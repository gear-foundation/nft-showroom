use crate::nft_messages::*;
use crate::NftMarketplace;
use gstd::{exec, msg, prelude::*, ActorId};
use nft_marketplace_io::*;

impl NftMarketplace {
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

        if let NftEvent::Transferred {
            owner,
            recipient: _,
            token_id,
        } =
            transfer_from_token(collection_address, msg_src, address_marketplace, token_id).await?
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
                if let NftEvent::Transferred {
                    owner: _,
                    recipient: _,
                    token_id,
                } = transfer_token(collection_address, nft_info.token_owner, token_id).await?
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

        transfer_token(collection_address, buyer, token_id).await?;

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
}
