use crate::nft_messages::*;
use crate::payment::*;
use crate::NftMarketplace;
use gstd::{exec, msg, prelude::*, ActorId};
use nft_marketplace_io::*;

impl NftMarketplace {
    pub async fn create_offer(
        &mut self,
        collection_address: ActorId,
        token_id: u64,
    ) -> Result<NftMarketplaceEvent, NftMarketplaceError> {
        let current_price = msg::value();

        if !self.collection_to_owner.contains_key(&collection_address) {
            return Err(NftMarketplaceError::WrongCollectionAddress);
        }

        let get_token_info_payload = NftAction::GetTokenInfo { token_id };
        let reply = msg::send_with_gas_for_reply_as::<NftAction, Result<NftEvent, NftError>>(
            collection_address,
            get_token_info_payload,
            self.config.gas_for_get_token_info,
            0,
            0,
        )
        .expect("Error during `NftAction::GetTokenInfo`")
        .await
        .expect("Problem with get token info");

        match reply {
            Err(_) => Err(NftMarketplaceError::ErrorFromCollection),
            Ok(NftEvent::TokenInfoReceived { sellable, .. }) => {
                if !sellable {
                    Err(NftMarketplaceError::NotSellable)
                } else {
                    Ok(())
                }
            }
            _ => Err(NftMarketplaceError::WrongReply),
        }?;

        let offer = Offer {
            collection_address,
            token_id,
            creator: msg::source(),
        };
        self.offers
            .entry(offer.clone())
            .and_modify(|price| {
                msg::send_with_gas(offer.creator, "", 0, *price).expect("Error in sending value");
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
            // use send_with_gas to transfer the value directly to the balance, not to the mailbox.
            msg::send_with_gas(offer.creator, "", 0, *price).expect("Error in sending value");
        } else {
            return Err(NftMarketplaceError::WrongDataOffer);
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
            return Err(NftMarketplaceError::AlreadyOnSale);
        }
        if self
            .auctions
            .contains_key(&(offer.collection_address, offer.token_id))
        {
            return Err(NftMarketplaceError::AlreadyOnAuction);
        }
        if !self.offers.contains_key(&offer) {
            return Err(NftMarketplaceError::OfferDoesNotExist);
        }

        // check token info
        let address_marketplace = exec::program_id();
        let msg_src = msg::source();
        let (collection_owner, royalty) = check_token_info(
            &offer.collection_address,
            offer.token_id,
            self.config.gas_for_get_token_info,
            &msg_src,
            &address_marketplace,
        )
        .await?;

        transfer_from_token(
            offer.collection_address,
            msg_src,
            offer.creator,
            offer.token_id,
            self.config.gas_for_transfer_token,
        )
        .await?;

        let price = self.offers.get(&offer).expect("Can't be None");

        // transfer value to token owner and percent to collection creator
        currency_transfer(
            collection_owner,
            msg_src,
            *price,
            royalty,
            self.config.minimum_transfer_value,
        );

        self.offers.remove(&offer);

        Ok(NftMarketplaceEvent::OfferAccepted { offer })
    }
}
