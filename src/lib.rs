#![no_std]

use gstd::{
    collections::HashMap, debug, exec, msg, prelude::*, prog::ProgramGenerator, ActorId, CodeId,
};
use nft_marketplace_io::*;

#[derive(Default)]
pub struct NftMarketplace {
    pub admins: Vec<ActorId>,
    pub collection_to_owner: HashMap<ActorId, ActorId>,
    pub time_creation: HashMap<ActorId, u64>,
    pub type_collections: HashMap<String, CollectionInfo>,
    pub sales: HashMap<(ActorId, u64), NftInfoForSale>,
    pub auctions: HashMap<(ActorId, u64), Auction>,
    pub offers: HashMap<Offer, u128>, // <Offer, price>
    pub config: Config,
}

static mut NFT_MARKETPLACE: Option<NftMarketplace> = None;

#[no_mangle]
extern "C" fn init() {
    let NftMarketplaceInit {
        gas_for_creation,
        time_between_create_collections,
        minimum_transfer_value,
    } = msg::load().expect("Unable to decode `NftMarketplaceInit`");

    let nft_marketplace = NftMarketplace {
        admins: vec![msg::source()],
        config: Config {
            gas_for_creation,
            time_between_create_collections,
            minimum_transfer_value,
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
            type_name,
            type_description,
        } => nft_marketplace.add_new_collection(code_id, meta_link, type_name, type_description),
        NftMarketplaceAction::CreateCollection { type_name, payload } => {
            nft_marketplace.create_collection(type_name, payload).await
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
        NftMarketplaceAction::CreateAuction {
            collection_address,
            token_id,
            min_price,
            duration_ms,
        } => {
            nft_marketplace
                .create_auction(collection_address, token_id, min_price, duration_ms)
                .await
        }
        NftMarketplaceAction::AddBid {
            collection_address,
            token_id,
        } => nft_marketplace.add_bid(collection_address, token_id),
        NftMarketplaceAction::CloseAuction {
            collection_address,
            token_id,
        } => {
            nft_marketplace
                .close_auction(collection_address, token_id)
                .await
        }
        NftMarketplaceAction::CancelAuction {
            collection_address,
            token_id,
        } => {
            nft_marketplace
                .cancel_auction(collection_address, token_id)
                .await
        }
        NftMarketplaceAction::CreateOffer {
            collection_address,
            token_id,
        } => nft_marketplace.create_offer(collection_address, token_id),
        NftMarketplaceAction::CancelOffer {
            collection_address,
            token_id,
        } => nft_marketplace.cancel_offer(collection_address, token_id),
        NftMarketplaceAction::AcceptOffer { offer } => nft_marketplace.accept_offer(offer).await,
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
        type_name: String,
        type_description: String,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        self.check_admin()?;

        let collection_info = CollectionInfo {
            code_id,
            meta_link: meta_link.clone(),
            type_description: type_description.clone(),
        };
        self.type_collections
            .insert(type_name.clone(), collection_info.clone());

        Ok(NftMarketplaceEvent::NewCollectionAdded {
            code_id,
            meta_link,
            type_name,
            type_description,
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
        type_name: String,
        payload: Vec<u8>,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        let msg_src = msg::source();
        self.check_time_creation()?;

        if !self.type_collections.contains_key(&type_name) {
            return Err(NftMarketplaceError(
                "There is no collection with this name yet.".to_owned(),
            ));
        }

        let collection_info = self
            .type_collections
            .get(&type_name)
            .expect("Unable to get Nft collection info");

        debug!("PAYLOAD: {:?}", payload);

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
            type_name,
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
        if self.sales.contains_key(&(collection_address, token_id)) {
            return Err(NftMarketplaceError(
                "This nft is already on sale.".to_owned(),
            ));
        }

        if self.auctions.contains_key(&(collection_address, token_id)) {
            return Err(NftMarketplaceError(
                "This token is on auction, cancel the auction if you wish to sale the nft"
                    .to_owned(),
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
        let (collection_owner, royalty) = if let NftEvent::TokenInfoReceived {
            token_owner,
            approval,
            sellable,
            collection_owner,
            royalty,
        } = self.check_reply(reply)?
        {
            if !sellable {
                return Err(NftMarketplaceError("Nft is not sellable".to_owned()));
            }
            if token_owner != msg_src {
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
            (collection_owner, royalty)
        } else {
            panic!("Wrong received reply");
        };

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
            self.sales.insert(
                (collection_address, token_id),
                NftInfoForSale {
                    price,
                    token_owner: owner,
                    collection_owner,
                    royalty,
                },
            );
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
        if let Some(nft_info) = self.sales.get(&(collection_address, token_id)) {
            if nft_info.token_owner == msg::source() {
                let transfer_payload = NftAction::Transfer {
                    to: nft_info.token_owner,
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
                    self.sales.remove(&(collection_address, token_id));
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
        self.check_sale(&collection_address, &token_id)?;

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
            .sales
            .get(&(collection_address, token_id))
            .expect("Can't be None")
            .clone();

        let percent_to_collection_creator = nft.price * (nft.royalty as u128) / 10_000u128;
        if percent_to_collection_creator > self.config.minimum_transfer_value {
            msg::send(nft.collection_owner, "", percent_to_collection_creator)
                .expect("Error in sending value");
            msg::send(
                nft.token_owner,
                "",
                nft.price - percent_to_collection_creator,
            )
            .expect("Error in sending value");
        } else {
            msg::send(nft.token_owner, "", nft.price).expect("Error in sending value");
        }

        self.sales
            .remove(&(collection_address, token_id))
            .expect("Can't be None");
        Ok(NftMarketplaceEvent::NftSold {
            current_owner: buyer,
            token_id,
            price: nft.price,
        })
    }

    pub async fn create_auction(
        &mut self,
        collection_address: ActorId,
        token_id: u64,
        min_price: u128,
        duration_ms: u32,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        if self.auctions.contains_key(&(collection_address, token_id)) {
            return Err(NftMarketplaceError(
                "This nft is already on auction".to_owned(),
            ));
        }
        if self.sales.contains_key(&(collection_address, token_id)) {
            return Err(NftMarketplaceError(
                "This token is on sale, cancel the sale if you wish to create the auction"
                    .to_owned(),
            ));
        }

        if min_price == 0 {
            return Err(NftMarketplaceError("Auction min price is zero".to_owned()));
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

        let (collection_owner, royalty) = if let NftEvent::TokenInfoReceived {
            token_owner,
            approval,
            sellable,
            collection_owner,
            royalty,
        } = self.check_reply(reply)?
        {
            if !sellable {
                return Err(NftMarketplaceError("Nft is not sellable".to_owned()));
            }
            if token_owner != msg_src {
                return Err(NftMarketplaceError(
                    "Only the owner can put his NFT up for auction.".to_owned(),
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
            (collection_owner, royalty)
        } else {
            panic!("Wrong received reply");
        };

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
            owner: _,
            recipient: _,
            token_id,
        } = self.check_reply(reply)?
        {
            self.auctions
                .entry((collection_address, token_id))
                .or_insert(Auction {
                    owner: msg_src,
                    started_at: exec::block_timestamp(),
                    ended_at: exec::block_timestamp() + duration_ms as u64,
                    current_price: min_price,
                    current_winner: ActorId::zero(),
                    collection_owner,
                    royalty,
                });
        } else {
            panic!("Wrong received reply");
        }

        msg::send_with_gas_delayed(
            address_marketplace,
            NftMarketplaceAction::CloseAuction {
                collection_address,
                token_id,
            },
            5_000_000_000,
            0,
            duration_ms / 3_000,
        )
        .expect("Error in sending delayed message");

        Ok(NftMarketplaceEvent::AuctionCreated {
            collection_address,
            token_id,
            min_price,
            duration_ms,
        })
    }

    pub fn add_bid(
        &mut self,
        collection_address: ActorId,
        token_id: u64,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        self.check_auction(&collection_address, &token_id)?;
        let auction = self
            .auctions
            .get_mut(&(collection_address, token_id))
            .expect("Can't be None");

        if auction.current_winner != ActorId::zero() {
            msg::send(auction.current_winner, "", auction.current_price)
                .expect("Error in sending value");
        }
        auction.current_winner = msg::source();
        auction.current_price = msg::value();

        Ok(NftMarketplaceEvent::BidAdded {
            collection_address,
            token_id,
        })
    }

    pub async fn close_auction(
        &mut self,
        collection_address: ActorId,
        token_id: u64,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        if msg::source() != exec::program_id() {
            return Err(NftMarketplaceError(
                "Only program can send this message.".to_owned(),
            ));
        }

        let auction = self
            .auctions
            .get(&(collection_address, token_id))
            .expect("There is no such auction");
        if auction.current_winner == ActorId::zero() {
            let transfer_payload = NftAction::Transfer {
                to: auction.owner,
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
        } else {
            let transfer_payload = NftAction::Transfer {
                to: auction.current_winner,
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

            let percent_to_collection_creator =
                auction.current_price * (auction.royalty as u128) / 10_000u128;
            if percent_to_collection_creator > self.config.minimum_transfer_value {
                msg::send(auction.collection_owner, "", percent_to_collection_creator)
                    .expect("Error in sending value");
                msg::send(
                    auction.owner,
                    "",
                    auction.current_price - percent_to_collection_creator,
                )
                .expect("Error in sending value");
            } else {
                msg::send(auction.owner, "", auction.current_price)
                    .expect("Error in sending value");
            }
        }

        let price = auction.current_price;
        let current_owner = auction.current_winner;

        self.auctions
            .remove(&(collection_address, token_id))
            .expect("Can't be None");

        Ok(NftMarketplaceEvent::AuctionClosed {
            collection_address,
            token_id,
            price,
            current_owner,
        })
    }

    pub async fn cancel_auction(
        &mut self,
        collection_address: ActorId,
        token_id: u64,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        let auction = self
            .auctions
            .get(&(collection_address, token_id))
            .expect("There is no such auction");

        if auction.owner != msg::source() {
            return Err(NftMarketplaceError(
                "Only the creator of the auction can send this message.".to_owned(),
            ));
        }
        let transfer_payload = NftAction::Transfer {
            to: auction.owner,
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

        if auction.current_winner != ActorId::zero() {
            msg::send(auction.current_winner, "", auction.current_price)
                .expect("Error in sending value");
        }

        self.auctions
            .remove(&(collection_address, token_id))
            .expect("Can't be None");

        Ok(NftMarketplaceEvent::AuctionCanceled {
            collection_address,
            token_id,
        })
    }

    pub fn create_offer(
        &mut self,
        collection_address: ActorId,
        token_id: u64,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        let current_price = msg::value();
        if current_price == 0 {
            return Err(NftMarketplaceError("msg::value is zero".to_owned()));
        }
        let offer = Offer {
            collection_address,
            token_id,
            creator: msg::source(),
        };
        self.offers
            .entry(offer.clone())
            .and_modify(|price| {
                msg::send(offer.creator, "", *price).expect("Error in sending value");
                *price = current_price;
            })
            .or_insert(current_price);

        Ok(NftMarketplaceEvent::OfferCreated {
            collection_address,
            token_id,
            price: current_price,
        })
    }

    pub fn cancel_offer(
        &mut self,
        collection_address: ActorId,
        token_id: u64,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        let offer = Offer {
            collection_address,
            token_id,
            creator: msg::source(),
        };

        if let Some((offer, price)) = self.offers.get_key_value(&offer) {
            msg::send(offer.creator, "", *price).expect("Error in sending value");
        } else {
            return Err(NftMarketplaceError(
                "This offer does not exist or you are not the creator of the offer".to_owned(),
            ));
        }
        self.offers.remove(&offer);

        Ok(NftMarketplaceEvent::OfferCanceled {
            collection_address,
            token_id,
        })
    }

    pub async fn accept_offer(
        &mut self,
        offer: Offer,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        if self
            .sales
            .contains_key(&(offer.collection_address, offer.token_id))
        {
            return Err(NftMarketplaceError(
                "This token is on sale, cancel the sale if you wish to accept the offer".to_owned(),
            ));
        }
        if self
            .auctions
            .contains_key(&(offer.collection_address, offer.token_id))
        {
            return Err(NftMarketplaceError(
                "This token is on auction, cancel the auction if you wish to accept the offer"
                    .to_owned(),
            ));
        }
        if !self.offers.contains_key(&offer) {
            return Err(NftMarketplaceError("This offer does not exist".to_owned()));
        }

        // get token info
        let get_token_info_payload = NftAction::GetTokenInfo {
            token_id: offer.token_id,
        };
        let reply = msg::send_for_reply_as::<NftAction, Result<NftEvent, NftError>>(
            offer.collection_address,
            get_token_info_payload,
            0,
            0,
        )
        .expect("Error during Collection program initialization")
        .await
        .expect("Program was not initialized");

        let address_marketplace = exec::program_id();
        let msg_src = msg::source();

        let (collection_owner, royalty) = if let NftEvent::TokenInfoReceived {
            token_owner,
            approval,
            sellable,
            collection_owner,
            royalty,
        } = self.check_reply(reply)?
        {
            if !sellable {
                return Err(NftMarketplaceError("Nft is not sellable".to_owned()));
            }
            if token_owner != msg_src {
                return Err(NftMarketplaceError(
                    "Only the owner nft can accept the offer.".to_owned(),
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
            (collection_owner, royalty)
        } else {
            panic!("Wrong received reply");
        };

        // transfer nft to new owner
        let transfer_payload = NftAction::TransferFrom {
            from: msg_src,
            to: offer.creator,
            token_id: offer.token_id,
        };
        let reply = msg::send_for_reply_as::<NftAction, Result<NftEvent, NftError>>(
            offer.collection_address,
            transfer_payload,
            0,
            0,
        )
        .expect("Error during Collection program initialization")
        .await
        .expect("Program was problem with transfer");

        self.check_reply(reply)?;

        let price = self.offers.get(&offer).expect("Can't be None");

        let percent_to_collection_creator = price * (royalty as u128) / 10_000u128;
        if percent_to_collection_creator > self.config.minimum_transfer_value {
            msg::send(collection_owner, "", percent_to_collection_creator)
                .expect("Error in sending value");
            msg::send(msg_src, "", *price - percent_to_collection_creator)
                .expect("Error in sending value");
        } else {
            msg::send(msg_src, "", *price).expect("Error in sending value");
        }

        self.offers.remove(&offer);

        Ok(NftMarketplaceEvent::OfferAccepted { offer })
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
                if answer {
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
        collection_address: &ActorId,
        token_id: &u64,
    ) -> Result<(), NftMarketplaceError> {
        let payment = msg::value();
        let nft = self.sales.get(&(*collection_address, *token_id));
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
    fn check_auction(
        &self,
        collection_address: &ActorId,
        token_id: &u64,
    ) -> Result<(), NftMarketplaceError> {
        let payment = msg::value();
        let auction = self.auctions.get(&(*collection_address, *token_id));
        if let Some(auction) = auction {
            if auction.ended_at < exec::block_timestamp() {
                return Err(NftMarketplaceError("Auction is already ended.".to_owned()));
            }
            if payment <= auction.current_price {
                return Err(NftMarketplaceError(
                    "Less than or equal to the current bid rate.".to_owned(),
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
                .into_iter()
                .map(|(id, collection_info)| (id, collection_info))
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
                .into_iter()
                .map(|(owner, collections)| (owner, collections))
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
            sales,
            auctions,
            offers,
            config,
        } = value;

        let collection_to_owner = collection_to_owner
            .into_iter()
            .map(|(owner, collections)| (owner, collections))
            .collect();

        let time_creation = time_creation
            .into_iter()
            .map(|(id, time)| (id, time))
            .collect();

        let type_collections = type_collections
            .into_iter()
            .map(|(id, collection_info)| (id, collection_info))
            .collect();

        let sales = sales.into_iter().map(|(id, info)| (id, info)).collect();
        let auctions = auctions
            .into_iter()
            .map(|(id, auction)| (id, auction))
            .collect();

        let offers = offers
            .into_iter()
            .map(|(offer, price)| (offer, price))
            .collect();

        Self {
            admins,
            collection_to_owner,
            time_creation,
            type_collections,
            sales,
            auctions,
            offers,
            config,
        }
    }
}
