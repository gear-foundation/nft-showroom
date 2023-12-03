#![no_std]

use gstd::{
    collections::{HashMap, HashSet},
    exec, msg,
    prelude::*,
    prog::ProgramGenerator,
    ActorId, CodeId,
};
use nft_marketplace_io::*;

#[derive(Default)]
pub struct NftMarketplace {
    pub admins: Vec<ActorId>,
    pub owner_to_collection: HashMap<ActorId, HashSet<ActorId>>,
    pub time_creation: HashMap<ActorId, u64>,
    pub collections: HashMap<u16, CollectionInfo>,
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
            description,
        } => nft_marketplace.add_new_collection(code_id, meta_link, description),
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
        NftMarketplaceAction::BuyNft {
            collection_address,
            token_id,
        } => nft_marketplace.buy(collection_address, token_id).await,
        NftMarketplaceAction::DeleteCollection { id_collection } => {
            nft_marketplace.delete_collection(id_collection)
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

        let max_key = *self.collections.keys().max().unwrap_or(&0);

        let collection_info = CollectionInfo {
            code_id,
            meta_link,
            description,
        };
        self.collections
            .insert(max_key + 1, collection_info.clone());

        Ok(NftMarketplaceEvent::NewCollectionAdded { collection_info })
    }

    fn check_time_creation(&self) -> Result<(), NftMarketplaceError> {
        let msg_src = msg::source();
        if let Some(time) = self.time_creation.get(&msg_src) {
            if exec::block_timestamp() - time < self.config.time_between_create_collections
                && !self.admins.contains(&msg_src)
            {
                return Err(NftMarketplaceError::Error(
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

        if !self.collections.contains_key(&id_collection) {
            return Err(NftMarketplaceError::Error(
                "There is no collection with this id_collection yet.".to_owned(),
            ));
        }

        let collection_info = self
            .collections
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

        self.owner_to_collection
            .entry(msg_src)
            .and_modify(|collections| {
                collections.insert(address);
            })
            .or_insert_with(|| {
                let mut collections = HashSet::new();
                collections.insert(address);

                collections
            });

        self.time_creation
            .entry(msg_src)
            .insert(exec::block_timestamp());

        Ok(NftMarketplaceEvent::CollectionCreated {
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
            return Err(NftMarketplaceError::Error(
                "This nft is already on sale.".to_owned(),
            ));
        }

        // check sellable
        let sellable_payload = NftAction::IsSellable;
        let reply = msg::send_for_reply_as::<NftAction, Result<NftEvent, NftError>>(
            collection_address,
            sellable_payload,
            0,
            0,
        )
        .expect("Error during Collection program initialization")
        .await
        .expect("Program was not initialized");

        if let NftEvent::IsSellable(sellable) = self.check_reply(reply)? {
            if sellable == false {
                return Err(NftMarketplaceError::Error("Nft is not sellable".to_owned()));
            }
        } else {
            panic!("Wrong received reply");
        }

        // check owner
        let msg_src = msg::source();
        let owner_payload = NftAction::Owner { token_id };
        let reply = msg::send_for_reply_as::<NftAction, Result<NftEvent, NftError>>(
            collection_address,
            owner_payload,
            0,
            0,
        )
        .expect("Error during Collection program initialization")
        .await
        .expect("Program was not initialized");

        if let NftEvent::Owner { owner, .. } = self.check_reply(reply)? {
            if owner != msg::source() {
                return Err(NftMarketplaceError::Error(
                    "Only the owner can put his NFT up for sale.".to_owned(),
                ));
            }
        } else {
            panic!("Wrong received reply");
        }

        // check that user give approve to marketplace
        let address_marketplace = exec::program_id();
        let is_approved_payload = NftAction::IsApproved {
            to: address_marketplace,
            token_id,
        };
        let reply = msg::send_for_reply_as::<NftAction, Result<NftEvent, NftError>>(
            collection_address,
            is_approved_payload,
            0,
            0,
        )
        .expect("Error during Collection program initialization")
        .await
        .expect("Program was not initialized");

        if let NftEvent::IsApproved { approved, .. } = self.check_reply(reply)? {
            if !approved {
                return Err(NftMarketplaceError::Error(
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
            previous_owner: nft.owner,
            current_owner: buyer,
            token_id,
            price: nft.price,
        })
    }

    pub fn delete_collection(
        &mut self,
        id_collection: u16,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        self.check_admin()?;
        if self.collections.remove(&id_collection).is_none() {
            return Err(NftMarketplaceError::Error(
                "There is no collection with this id".to_owned(),
            ));
        }
        Ok(NftMarketplaceEvent::CollectionDeleted { id_collection })
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
            return Err(NftMarketplaceError::Error(
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
                return Err(NftMarketplaceError::Error(
                    "Less than the agreed price.".to_owned(),
                ));
            }
        } else {
            return Err(NftMarketplaceError::Error(
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
            Err(NftError::Error(error_string)) => {
                Err(NftMarketplaceError::Error(error_string.clone()))
            }
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
            let collections = nft_marketplace
                .collections
                .iter()
                .map(|(id, collection_info)| (*id, collection_info.clone()))
                .collect();
            msg::reply(StateReply::CollectionsInfo(collections), 0)
                .expect("Unable to share the state");
        }
        StateQuery::Config => {
            msg::reply(StateReply::Config(nft_marketplace.config), 0)
                .expect("Unable to share the state");
        }
        StateQuery::GetOwnerCollections(owner) => {
            let address_collection = nft_marketplace
                .owner_to_collection
                .get(&owner)
                .expect("This address was not involved in the creation of the collection");
            msg::reply(
                StateReply::OwnerCollections(address_collection.iter().cloned().collect()),
                0,
            )
            .expect("Unable to share the state");
        }
        StateQuery::AllCollections => {
            let owner_to_collection = nft_marketplace
                .owner_to_collection
                .iter()
                .map(|(owner, collections)| (*owner, collections.iter().cloned().collect()))
                .collect();
            msg::reply(StateReply::AllCollections(owner_to_collection), 0)
                .expect("Unable to share the state");
        }
    }
}

impl From<NftMarketplace> for State {
    fn from(value: NftMarketplace) -> Self {
        let NftMarketplace {
            admins,
            owner_to_collection,
            time_creation,
            collections,
            sale,
            config,
        } = value;

        let owner_to_collection = owner_to_collection
            .iter()
            .map(|(owner, collections)| (*owner, collections.iter().cloned().collect()))
            .collect();

        let time_creation = time_creation
            .iter()
            .map(|(id, time)| (*id, *time))
            .collect();

        let collections = collections
            .iter()
            .map(|(id, collection_info)| (*id, collection_info.clone()))
            .collect();

        let sale = sale.iter().map(|(id, info)| (*id, info.clone())).collect();

        Self {
            admins,
            owner_to_collection,
            time_creation,
            collections,
            sale,
            config,
        }
    }
}
