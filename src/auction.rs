use crate::nft_messages::*;
use crate::payment::*;
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
        if !self.collection_to_owner.contains_key(&collection_address) {
            return Err(NftMarketplaceError(
                "This collection address is not in the marketplace".to_owned(),
            ));
        }
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

        if min_price < self.config.minimum_transfer_value {
            return Err(NftMarketplaceError(format!(
                "Auction min price must be greater than existential deposit ({})",
                self.config.minimum_transfer_value
            )));
        }

        // check token info
        let address_marketplace = exec::program_id();
        let msg_src = msg::source();
        let (collection_owner, royalty) = check_token_info(
            &collection_address,
            token_id,
            self.config.gas_for_get_token_info,
            &msg_src,
            &address_marketplace,
        )
        .await?;

        if let NftEvent::Transferred {
            owner: _,
            recipient: _,
            token_id,
        } = transfer_from_token(
            collection_address,
            msg_src,
            address_marketplace,
            token_id,
            self.config.gas_for_transfer_token,
        )
        .await?
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
            return Err(NftMarketplaceError("Wrong received reply".to_owned()));
        }

        msg::send_with_gas_delayed(
            address_marketplace,
            NftMarketplaceAction::CloseAuction {
                collection_address,
                token_id,
            },
            self.config.gas_for_close_auction,
            0,
            duration_ms / self.config.ms_in_block + 1,
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
        let msg_value = msg::value();
        let auction = self.check_auction(&collection_address, &token_id, &msg_value)?;

        if auction.current_winner != ActorId::zero() {
            // use send_with_gas to transfer the value directly to the balance, not to the mailbox.
            msg::send_with_gas(auction.current_winner, "", 0, auction.current_price)
                .expect("Error in sending value");
        }
        auction.current_winner = msg::source();
        auction.current_price = msg_value;

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
        let msg_src = msg::source();
        if msg_src != exec::program_id() && !self.admins.contains(&msg_src) {
            return Err(NftMarketplaceError(
                "Only program or admin can send this message.".to_owned(),
            ));
        }

        let (price, current_owner) =
            if let Some(auction) = self.auctions.get(&(collection_address, token_id)) {
                if auction.ended_at > exec::block_timestamp() {
                    return Err(NftMarketplaceError(
                        "The auction must not end before the deadline".to_owned(),
                    ));
                }
                if auction.current_winner == ActorId::zero() {
                    transfer_token(
                        collection_address,
                        auction.owner,
                        token_id,
                        self.config.gas_for_transfer_token,
                    )
                    .await?;
                } else {
                    transfer_token(
                        collection_address,
                        auction.current_winner,
                        token_id,
                        self.config.gas_for_transfer_token,
                    )
                    .await?;

                    // transfer value to buyer and percent to collection creator
                    currency_transfer(
                        auction.collection_owner,
                        auction.owner,
                        auction.current_price,
                        auction.royalty,
                        self.config.minimum_transfer_value,
                    );
                }
                let price = auction.current_price;
                let current_owner = auction.current_winner;
                (price, current_owner)
            } else {
                return Err(NftMarketplaceError("There is no such auction".to_owned()));
            };

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
        if let Some(auction) = self.auctions.get(&(collection_address, token_id)) {
            if auction.owner != msg::source() {
                return Err(NftMarketplaceError(
                    "Only the creator of the auction can send this message".to_owned(),
                ));
            }
            transfer_token(
                collection_address,
                auction.owner,
                token_id,
                self.config.gas_for_transfer_token,
            )
            .await?;

            if auction.current_winner != ActorId::zero() {
                // use send_with_gas to transfer the value directly to the balance, not to the mailbox.
                msg::send_with_gas(auction.current_winner, "", 0, auction.current_price)
                    .expect("Error in sending value");
            }
        } else {
            return Err(NftMarketplaceError(
                "There is no auction with this collection address and token id".to_owned(),
            ));
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
        &mut self,
        collection_address: &ActorId,
        token_id: &u64,
        bid: &u128,
    ) -> Result<&mut Auction, NftMarketplaceError> {
        let auction =
            if let Some(auction) = self.auctions.get_mut(&(*collection_address, *token_id)) {
                if auction.ended_at < exec::block_timestamp() {
                    return Err(NftMarketplaceError("Auction is already ended.".to_owned()));
                }
                if *bid <= auction.current_price {
                    return Err(NftMarketplaceError(
                        "Less than or equal to the current bid rate.".to_owned(),
                    ));
                }
                auction
            } else {
                return Err(NftMarketplaceError(
                    "There is no auction with this collection address and token id".to_owned(),
                ));
            };
        Ok(auction)
    }
}
