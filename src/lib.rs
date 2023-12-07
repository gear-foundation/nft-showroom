#![no_std]

use gstd::{collections::HashMap, exec, msg, prelude::*, prog::ProgramGenerator, ActorId, CodeId};
use nft_marketplace_io::*;

#[derive(Default)]
pub struct NftMarketplace {
    pub admins: Vec<ActorId>,
    pub collection_to_owner: HashMap<ActorId, ActorId>,
    pub time_creation: HashMap<ActorId, u64>,
    pub type_collections: HashMap<u16, CollectionInfo>,
    pub sale: HashMap<(ActorId, u64), NftInfoForSale>,
    pub config: Config,
}

static mut NFT_MARKETPLACE: Option<NftMarketplace> = None;

#[no_mangle]
extern "C" fn init() {
    let NftMarketplaceInit {
        gas_for_creation,
        time_between_create_collections,
    } = msg::load().expect("Unable to decode `NftMarketplaceInit`");

    let nft_marketplace = NftMarketplace {
        admins: vec![msg::source()],
        config: Config {
            gas_for_creation,
            time_between_create_collections,
        },
        ..Default::default()
    };
    unsafe { NFT_MARKETPLACE = Some(nft_marketplace) };
}

#[gstd::async_main]
async fn main() {
    let action: NftMarketplaceAction =
        msg::load().expect("Unable to decode `NftMarketplaceAction`");
    let nft_marketplace = unsafe {
        NFT_MARKETPLACE
            .as_mut()
            .expect("`Collection Factory` is not initialized.")
    };
    let result = match action {
        NftMarketplaceAction::AddNewCollection {
            code_id,
            meta_link,
            type_description,
        } => nft_marketplace.add_new_collection(code_id, meta_link, type_description),
        NftMarketplaceAction::CreateCollection {
            id_collection,
            payload,
        } => {
            nft_marketplace
                .create_collection(id_collection, payload)
                .await
        }
        NftMarketplaceAction::SaleNft {
            collection_address,
            token_id,
            price,
        } => {
            nft_marketplace
                .sell(collection_address, token_id, price)
                .await
        }
        NftMarketplaceAction::CancelSaleNft {
            collection_address,
            token_id,
        } => {
            nft_marketplace
                .cancel_sale(collection_address, token_id)
                .await
        }
        NftMarketplaceAction::BuyNft {
            collection_address,
            token_id,
        } => nft_marketplace.buy(collection_address, token_id).await,
        NftMarketplaceAction::DeleteCollection { collection_address } => {
            nft_marketplace.delete_collection(collection_address).await
        }
        NftMarketplaceAction::AddAdmins { users } => nft_marketplace.add_admins(users),
        NftMarketplaceAction::DeleteAdmin { user } => nft_marketplace.delete_admin(user),
        NftMarketplaceAction::UpdateConfig {
            gas_for_creation,
            time_between_create_collections,
        } => nft_marketplace.update_config(gas_for_creation, time_between_create_collections),
    };

    msg::reply(result, 0).expect(
        "Failed to encode or reply with `Result<NftMarketplaceEvent, NftMarketplaceError>`.",
    );
}

impl NftMarketplace {
    pub fn add_new_collection(
        &mut self,
        code_id: CodeId,
        meta_link: String,
        description: String,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        self.check_admin()?;

        let max_key = *self.type_collections.keys().max().unwrap_or(&0);

        let collection_info = CollectionInfo {
            code_id,
            meta_link: meta_link.clone(),
            description: description.clone(),
        };
        self.type_collections
            .insert(max_key + 1, collection_info.clone());

        Ok(NftMarketplaceEvent::NewCollectionAdded {
            code_id,
            meta_link,
            description,
            id_collection: max_key + 1,
        })
    }

    fn check_time_creation(&self) -> Result<(), NftMarketplaceError> {
        let msg_src = msg::source();
        if let Some(time) = self.time_creation.get(&msg_src) {
            if exec::block_timestamp() - time < self.config.time_between_create_collections
                && !self.admins.contains(&msg_src)
            {
                return Err(NftMarketplaceError(
                    "The time limit for creating a collection has not yet expired.".to_owned(),
                ));
            }
        }
        Ok(())
    }

    pub async fn create_collection(
        &mut self,
        id_collection: u16,
        payload: Vec<u8>,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        let msg_src = msg::source();
        self.check_time_creation()?;

        if !self.type_collections.contains_key(&id_collection) {
            return Err(NftMarketplaceError(
                "There is no collection with this id_collection yet.".to_owned(),
            ));
        }

        let collection_info = self
            .type_collections
            .get(&id_collection)
            .expect("Unable to get Nft collection info");

        let (address, _) = ProgramGenerator::create_program_bytes_with_gas_for_reply(
            collection_info.code_id,
            payload,
            self.config.gas_for_creation,
            0,
            0,
        )
        .expect("Error during Collection program initialization")
        .await
        .expect("Program was not initialized");

        self.collection_to_owner.insert(address, msg_src);

        self.time_creation
            .entry(msg_src)
            .insert(exec::block_timestamp());

        Ok(NftMarketplaceEvent::CollectionCreated {
            id_collection,
            collection_address: address,
        })
    }
    pub async fn sell(
        &mut self,
        collection_address: ActorId,
        token_id: u64,
        price: u128,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        // check that this nft is not sale at this moment
        if self.sale.contains_key(&(collection_address, token_id)) {
            return Err(NftMarketplaceError(
                "This nft is already on sale.".to_owned(),
            ));
        }

        // get token info
        let get_token_info_payload = NftAction::GetTokenInfo { token_id };
        let reply = msg::send_for_reply_as::<NftAction, Result<NftEvent, NftError>>(
            collection_address,
            get_token_info_payload,
            0,
            0,
        )
        .expect("Error during Collection program initialization")
        .await
        .expect("Program was not initialized");

        let address_marketplace = exec::program_id();
        let msg_src = msg::source();
        if let NftEvent::TokenInfoReceived {
            owner,
            approval,
            sellable,
        } = self.check_reply(reply)?
        {
            if !sellable {
                return Err(NftMarketplaceError("Nft is not sellable".to_owned()));
            }
            if owner != msg_src {
                return Err(NftMarketplaceError(
                    "Only the owner can put his NFT up for sale.".to_owned(),
                ));
            }
            if let Some(approve_acc) = approval {
                if approve_acc != address_marketplace {
                    return Err(NftMarketplaceError(
                        "No approve to the marketplace".to_owned(),
                    ));
                }
            } else {
                return Err(NftMarketplaceError(
                    "No approve to the marketplace".to_owned(),
                ));
            }
        } else {
            panic!("Wrong received reply");
        }

        // transfer nft to marketplace
        let transfer_payload = NftAction::TransferFrom {
            from: msg_src,
            to: address_marketplace,
            token_id,
        };
        let reply = msg::send_for_reply_as::<NftAction, Result<NftEvent, NftError>>(
            collection_address,
            transfer_payload,
            0,
            0,
        )
        .expect("Error during Collection program initialization")
        .await
        .expect("Program was problem with transfer");

        if let NftEvent::Transferred {
            owner,
            recipient: _,
            token_id,
        } = self.check_reply(reply)?
        {
            self.sale
                .entry((collection_address, token_id))
                .or_insert(NftInfoForSale { price, owner });
        } else {
            panic!("Wrong received reply");
        }

        Ok(NftMarketplaceEvent::SaleNft {
            collection_address,
            token_id,
            price,
            owner: msg_src,
        })
    }
    pub async fn cancel_sale(
        &mut self,
        collection_address: ActorId,
        token_id: u64,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        if let Some(nft_info) = self.sale.get(&(collection_address, token_id)) {
            if nft_info.owner == msg::source() {
                let transfer_payload = NftAction::Transfer {
                    to: nft_info.owner,
                    token_id,
                };
                let reply = msg::send_for_reply_as::<NftAction, Result<NftEvent, NftError>>(
                    collection_address,
                    transfer_payload,
                    0,
                    0,
                )
                .expect("Error during Collection program transfer")
                .await
                .expect("Program was problem with transfer");

                if let NftEvent::Transferred {
                    owner: _,
                    recipient: _,
                    token_id,
                } = self.check_reply(reply)?
                {
                    self.sale.remove(&(collection_address, token_id));
                } else {
                    panic!("Wrong received reply");
                }
            } else {
                return Err(NftMarketplaceError(
                    "Only the nft owner can cancel the sale.".to_owned(),
                ));
            }
        } else {
            return Err(NftMarketplaceError(
                "This sale does not exist. Wrong collection_address or token_id".to_owned(),
            ));
        }

        Ok(NftMarketplaceEvent::SaleNftCanceled {
            collection_address,
            token_id,
        })
    }
    pub async fn buy(
        &mut self,
        collection_address: ActorId,
        token_id: u64,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        let buyer = msg::source();
        self.check_sale(collection_address, token_id)?;

        // transfer nft to new owner
        let transfer_payload = NftAction::Transfer {
            to: buyer,
            token_id,
        };
        let reply = msg::send_for_reply_as::<NftAction, Result<NftEvent, NftError>>(
            collection_address,
            transfer_payload,
            0,
            0,
        )
        .expect("Error during Collection program initialization")
        .await
        .expect("Program was problem with transfer");

        self.check_reply(reply)?;

        let nft = self
            .sale
            .get(&(collection_address, token_id))
            .expect("Can't be None")
            .clone();
        msg::send_with_gas(nft.owner, "", 0, nft.price).expect("Error in sending value");
        self.sale
            .remove(&(collection_address, token_id))
            .expect("Can't be None");
        Ok(NftMarketplaceEvent::NftSold {
            current_owner: buyer,
            token_id,
            price: nft.price,
        })
    }

    pub async fn delete_collection(
        &mut self,
        collection_address: ActorId,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        let msg_src = msg::source();

        let collection_owner =
            if let Some(owner) = self.collection_to_owner.get(&collection_address) {
                *owner
            } else {
                return Err(NftMarketplaceError(
                    "There is no collection with that address".to_owned(),
                ));
            };

        if self.admins.contains(&msg_src) {
            self.collection_to_owner.remove(&collection_address);
        }
        if collection_owner == msg_src {
            let reply = msg::send_for_reply_as::<NftAction, Result<NftEvent, NftError>>(
                collection_address,
                NftAction::CanDelete,
                0,
                0,
            )
            .expect("Error during Collection program initialization")
            .await
            .expect("Program was problem with transfer");

            if let NftEvent::CanDelete(answer) = self.check_reply(reply)? {
                if answer{
                    self.collection_to_owner.remove(&collection_address);
                } else {
                    return Err(NftMarketplaceError("Removal denied".to_owned()));
                }
            } else {
                panic!("Wrong received reply");
            }
        }

        Ok(NftMarketplaceEvent::CollectionDeleted { collection_address })
    }

    pub fn add_admins(
        &mut self,
        users: Vec<ActorId>,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        self.check_admin()?;
        self.admins.extend(users.clone());
        Ok(NftMarketplaceEvent::AdminsAdded { users })
    }
    pub fn delete_admin(
        &mut self,
        user: ActorId,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        self.check_admin()?;
        self.admins.retain(|&admin| admin != user);
        Ok(NftMarketplaceEvent::AdminDeleted { user })
    }
    pub fn update_config(
        &mut self,
        gas_for_creation: Option<u64>,
        time_between_create_collections: Option<u64>,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        self.check_admin()?;
        if let Some(gas) = gas_for_creation {
            self.config.gas_for_creation = gas;
        }
        if let Some(time) = time_between_create_collections {
            self.config.time_between_create_collections = time;
        }

        Ok(NftMarketplaceEvent::ConfigUpdated {
            gas_for_creation,
            time_between_create_collections,
        })
    }
    fn check_admin(&self) -> Result<(), NftMarketplaceError> {
        if !self.admins.contains(&msg::source()) {
            return Err(NftMarketplaceError(
                "Only admin can send this message".to_owned(),
            ));
        }
        Ok(())
    }
    fn check_sale(
        &self,
        collection_address: ActorId,
        token_id: u64,
    ) -> Result<(), NftMarketplaceError> {
        let payment = msg::value();
        let nft = self.sale.get(&(collection_address, token_id));
        if let Some(nft) = nft {
            if payment < nft.price {
                return Err(NftMarketplaceError(
                    "Less than the agreed price.".to_owned(),
                ));
            }
        } else {
            return Err(NftMarketplaceError(
                "Wrong collection_address or token_id.".to_owned(),
            ));
        }
        Ok(())
    }
    fn check_reply(
        &self,
        reply: Result<NftEvent, NftError>,
    ) -> Result<NftEvent, NftMarketplaceError> {
        match reply {
            Ok(result) => Ok(result),
            Err(NftError::Error(error_string)) => Err(NftMarketplaceError(error_string.clone())),
        }
    }
}

#[no_mangle]
extern "C" fn state() {
    let nft_marketplace = unsafe {
        NFT_MARKETPLACE
            .take()
            .expect("Contract state is uninitialized")
    };
    let query: StateQuery = msg::load().expect("Unable to load the state query");
    match query {
        StateQuery::All => {
            msg::reply(StateReply::All(nft_marketplace.into()), 0)
                .expect("Unable to share the state");
        }

        StateQuery::Admins => {
            msg::reply(StateReply::Admins(nft_marketplace.admins), 0)
                .expect("Unable to share the state");
        }
        StateQuery::CollectionsInfo => {
            let type_collections = nft_marketplace
                .type_collections
                .iter()
                .map(|(id, collection_info)| (*id, collection_info.clone()))
                .collect();
            msg::reply(StateReply::CollectionsInfo(type_collections), 0)
                .expect("Unable to share the state");
        }
        StateQuery::Config => {
            msg::reply(StateReply::Config(nft_marketplace.config), 0)
                .expect("Unable to share the state");
        }
        StateQuery::AllCollections => {
            let collection_to_owner = nft_marketplace
                .collection_to_owner
                .iter()
                .map(|(owner, collections)| (*owner, *collections))
                .collect();
            msg::reply(StateReply::AllCollections(collection_to_owner), 0)
                .expect("Unable to share the state");
        }
    }
}

impl From<NftMarketplace> for State {
    fn from(value: NftMarketplace) -> Self {
        let NftMarketplace {
            admins,
            collection_to_owner,
            time_creation,
            type_collections,
            sale,
            config,
        } = value;

        let collection_to_owner = collection_to_owner
            .iter()
            .map(|(owner, collections)| (*owner, *collections))
            .collect();

        let time_creation = time_creation
            .iter()
            .map(|(id, time)| (*id, *time))
            .collect();

        let type_collections = type_collections
            .iter()
            .map(|(id, collection_info)| (*id, collection_info.clone()))
            .collect();

        let sale = sale.iter().map(|(id, info)| (*id, info.clone())).collect();

        Self {
            admins,
            collection_to_owner,
            time_creation,
            type_collections,
            sale,
            config,
        }
    }
}
