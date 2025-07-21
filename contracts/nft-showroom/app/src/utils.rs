use crate::Storage;
use crate::nft_io::{GetTokenInfo, TransferFrom};
use core::fmt::Debug;
use gstd::{ext, format};
use sails_rs::calls::ActionIo;
use sails_rs::gstd::{exec, msg};
use sails_rs::prelude::*;

pub fn panic(err: impl Debug) -> ! {
    ext::panic_bytes(format!("{err:?}").as_bytes())
}

pub type CollectionId = ActorId;
pub type TokenId = u64;
pub type Price = u128;
pub type TypeName = String;

#[derive(Debug, Encode, Decode, TypeInfo, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct NftInfoForSale {
    pub price: u128,
    pub token_owner: ActorId,
    pub collection_owner: ActorId,
    pub royalty: u16,
}

#[derive(Debug, Encode, Decode, TypeInfo, Clone, PartialEq, Eq, Hash)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Offer {
    pub collection_address: ActorId,
    pub token_id: u64,
    pub creator: ActorId,
}

#[derive(Debug, Encode, Decode, TypeInfo, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Auction {
    pub owner: ActorId,
    pub started_at: u64,
    pub ended_at: u64,
    pub current_price: u128,
    pub current_winner: ActorId,
    pub collection_owner: ActorId,
    pub royalty: u16,
}

#[derive(Default, Debug, Encode, Decode, TypeInfo, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Config {
    pub gas_for_creation: u64,
    pub gas_for_mint: u64,
    pub gas_for_transfer_token: u64,
    pub gas_for_close_auction: u64,
    pub gas_for_delete_collection: u64,
    pub gas_for_get_info: u64,
    pub time_between_create_collections: u64,
    pub royalty_to_marketplace_for_trade: u16,
    pub royalty_to_marketplace_for_mint: u16,
    pub ms_in_block: u32,
    pub fee_per_uploaded_file: u128,
    pub max_creator_royalty: u16,
    pub max_number_of_images: u64,
}

/// * code_id - code_id is used to create a collection by that CodeId,
///   the admin should preload the NFT contract and specify in the marketplace so that regular users can use it
/// * meta_link -  it is necessary to set a reference where the meta of this collection type will be stored for further interaction with the contract
/// * type_description - description of this type of collection
#[derive(Debug, Encode, Decode, TypeInfo, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct TypeCollectionInfo {
    pub code_id: CodeId,
    pub meta_link: String,
    pub type_description: String,
    pub allow_create: bool,
}

#[derive(Debug, Encode, Decode, TypeInfo, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct CollectionInfo {
    pub owner: ActorId,
    pub type_name: String,
    pub meta_link: String,
}

pub fn currency_transfer(
    collection_owner: ActorId,
    token_owner: ActorId,
    price: u128,
    royalty: u16,
    royalty_to_marketplace: u16,
) {
    // calculate the percentage to the creator of the collection
    // current_price * royalty / 10_000
    let percent_to_collection_creator = price * (royalty as u128) / 10_000u128;
    let percent_to_marketplace = price * (royalty_to_marketplace as u128) / 10_000u128;
    if percent_to_collection_creator > exec::env_vars().existential_deposit {
        // use send_with_gas to transfer the value directly to the balance, not to the mailbox.
        msg::send_with_gas(collection_owner, (), 0, percent_to_collection_creator)
            .expect("Error in sending value");

        msg::send_with_gas(
            token_owner,
            (),
            0,
            price - percent_to_collection_creator - percent_to_marketplace,
        )
        .expect("Error in sending value");
    } else {
        msg::send_with_gas(token_owner, (), 0, price - percent_to_marketplace)
            .expect("Error in sending value");
    }
}

pub fn check_sale(storage: &Storage, collection_address: &ActorId, token_id: &u64, payment: u128) {
    // check that such a sale exists and check the attached amount
    let nft = storage
        .sales
        .get(&(*collection_address, *token_id))
        .expect("Sale does not exist");

    if payment < nft.price {
        panic!("Value is less than price");
    }
}

pub async fn transfer_from_token(
    storage: &Storage,
    collection_address: ActorId,
    from: ActorId,
    to: ActorId,
    token_id: u64,
) {
    let request = TransferFrom::encode_call(from, to, token_id);
    msg::send_bytes_with_gas_for_reply(
        collection_address,
        request,
        storage.config.gas_for_transfer_token,
        0,
        0,
    )
    .expect("Error in sending a message")
    .await
    .expect("Error in `TransferFrom`");
}

pub async fn check_token_info(
    storage: &Storage,
    collection_address: &ActorId,
    token_id: u64,
    msg_src: &ActorId,
    address_marketplace: &ActorId,
) -> (ActorId, u16) {
    let request = GetTokenInfo::encode_call(token_id);

    let reply_bytes = msg::send_bytes_with_gas_for_reply(
        *collection_address,
        request,
        storage.config.gas_for_get_info,
        0,
        0,
    )
    .expect("Error in sending a message")
    .await
    .expect("Error in `GetTokenInfo`");

    let nft_client::TokenInfo {
        token_owner,
        approval,
        sellable,
        collection_owner,
        royalty,
    } = GetTokenInfo::decode_reply(&reply_bytes).expect("Error get token info");

    // nft should be sellable
    if !sellable {
        panic("Not sellable");
    }
    // the owner must be the same as the one who wants to sell
    if token_owner != *msg_src {
        panic("Access denied");
    }
    // must be approved by the marketplace
    let approve_acc = approval.expect("No approve to marketplace");
    if approve_acc != *address_marketplace {
        panic("No approve to marketplace");
    }
    (collection_owner, royalty)
}

pub fn check_admin(storage: &Storage, msg_src: &ActorId) {
    if !storage.admins.contains(msg_src) {
        panic!("Access denied");
    }
}
pub fn check_time_creation(storage: &Storage, user: &ActorId) {
    if let Some(time) = storage.time_creation.get(user) {
        if exec::block_timestamp() - time < storage.config.time_between_create_collections
            && !storage.admins.contains(user)
        {
            panic!("Deadline error");
        }
    }
}
pub fn check_allow_message(storage: &Storage, msg_src: &ActorId) {
    if !storage.allow_message && !storage.admins.contains(msg_src) {
        panic!("Access denied");
    }
}
pub fn check_allow_create_collection(storage: &Storage, msg_src: &ActorId) {
    if !storage.allow_create_collection && !storage.admins.contains(msg_src) {
        panic!("Access denied");
    }
}

#[derive(Debug, Encode, Decode, TypeInfo, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct StorageState {
    pub admins: Vec<ActorId>,
    pub collection_to_owner: Vec<(ActorId, (String, ActorId))>,
    pub time_creation: Vec<(ActorId, u64)>,
    pub type_collections: Vec<(String, TypeCollectionInfo)>,
    pub sales: Vec<((ActorId, u64), NftInfoForSale)>,
    pub auctions: Vec<((ActorId, u64), Auction)>,
    pub offers: Vec<(Offer, u128)>,
    pub config: Config,
    pub minimum_value_for_trade: u128,
    pub allow_message: bool,
    pub allow_create_collection: bool,
}

impl From<&Storage> for StorageState {
    fn from(value: &Storage) -> Self {
        let Storage {
            admins,
            collection_to_owner,
            time_creation,
            type_collections,
            sales,
            auctions,
            offers,
            config,
            minimum_value_for_trade,
            allow_message,
            allow_create_collection,
        } = value;

        let collection_to_owner = collection_to_owner.clone().into_iter().collect();

        let time_creation = time_creation.clone().into_iter().collect();

        let type_collections = type_collections.clone().into_iter().collect();

        let sales = sales.clone().into_iter().collect();
        let auctions = auctions.clone().into_iter().collect();

        let offers = offers.clone().into_iter().collect();

        Self {
            admins: admins.to_vec(),
            collection_to_owner,
            time_creation,
            type_collections,
            sales,
            auctions,
            offers,
            config: config.clone(),
            minimum_value_for_trade: *minimum_value_for_trade,
            allow_message: *allow_message,
            allow_create_collection: *allow_create_collection,
        }
    }
}
