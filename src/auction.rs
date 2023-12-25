use crate::nft_messages::*;
use crate::NftMarketplace;
use gstd::{exec, msg, prelude::*, ActorId};
use nft_marketplace_io::*;

impl NftMarketplace {
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
        let address_marketplace = exec::program_id();
        let msg_src = msg::source();

        let (collection_owner, royalty) = if let NftEvent::TokenInfoReceived {
            token_owner,
            approval,
            sellable,
            collection_owner,
            royalty,
        } =
            get_token_info(collection_address, token_id).await?
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

        if let NftEvent::Transferred {
            owner: _,
            recipient: _,
            token_id,
        } =
            transfer_from_token(collection_address, msg_src, address_marketplace, token_id).await?
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
            transfer_token(collection_address, auction.owner, token_id).await?;
        } else {
            transfer_token(collection_address, auction.current_winner, token_id).await?;

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
        transfer_token(collection_address, auction.owner, token_id).await?;

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
}
