use crate::nft_messages::*;
use crate::NftMarketplace;
use gstd::{exec, msg, prelude::*, ActorId};
use nft_marketplace_io::*;

impl NftMarketplace {
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

        let address_marketplace = exec::program_id();
        let msg_src = msg::source();

        let (collection_owner, royalty) = if let NftEvent::TokenInfoReceived {
            token_owner,
            approval,
            sellable,
            collection_owner,
            royalty,
        } =
            get_token_info(offer.collection_address, offer.token_id).await?
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

        transfer_from_token(
            offer.collection_address,
            msg_src,
            offer.creator,
            offer.token_id,
        )
        .await?;

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
}
