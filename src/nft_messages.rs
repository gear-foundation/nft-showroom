use gstd::{msg, prelude::*, ActorId};
use nft_marketplace_io::*;

pub async fn transfer_token(
    collection_address: ActorId,
    to: ActorId,
    token_id: u64,
) -> Result<NftEvent, NftMarketplaceError> {
    let transfer_payload = NftAction::Transfer { to, token_id };
    let reply = msg::send_for_reply_as::<NftAction, Result<NftEvent, NftError>>(
        collection_address,
        transfer_payload,
        0,
        0,
    )
    .expect("Error during Collection program initialization")
    .await
    .expect("Program was problem with transfer");

    check_reply(reply)
}

pub async fn transfer_from_token(
    collection_address: ActorId,
    from: ActorId,
    to: ActorId,
    token_id: u64,
) -> Result<NftEvent, NftMarketplaceError> {
    let transfer_payload = NftAction::TransferFrom { from, to, token_id };
    let reply = msg::send_for_reply_as::<NftAction, Result<NftEvent, NftError>>(
        collection_address,
        transfer_payload,
        0,
        0,
    )
    .expect("Error during Collection program initialization")
    .await
    .expect("Program was problem with transfer");

    check_reply(reply)
}

pub async fn get_token_info(
    collection_address: ActorId,
    token_id: u64,
) -> Result<NftEvent, NftMarketplaceError> {
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

    check_reply(reply)
}

fn check_reply(reply: Result<NftEvent, NftError>) -> Result<NftEvent, NftMarketplaceError> {
    match reply {
        Ok(result) => Ok(result),
        Err(NftError::Error(error_string)) => Err(NftMarketplaceError(error_string.clone())),
    }
}
