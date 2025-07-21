use crate::Storage;
use core::fmt::Debug;
use gstd::{ext, format};
use sails_rs::gstd::{exec, msg};
use sails_rs::prelude::*;

pub type NftId = u64;
pub const FEE_PER_UPLOADED_FILE: u128 = 282_857_142_900;
pub const MAX_CREATOR_ROYALTY: u16 = 1_000; // 10%
static mut SEED: u8 = 0;

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct NftData {
    pub owner: ActorId,
    pub name: String,
    pub description: String,
    pub metadata: Vec<String>,
    pub media_url: String,
    pub mint_time: u64,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct ImageData {
    pub limit_copies: Option<u32>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Config {
    pub name: String,
    pub description: String,
    pub collection_tags: Vec<String>,
    pub collection_banner: String,
    pub collection_logo: String,
    pub user_mint_limit: Option<u32>,
    pub additional_links: Option<AdditionalLinks>,
    pub royalty: u16,
    pub payment_for_mint: u128,
    pub transferable: Option<u64>,
    pub sellable: Option<u64>,
    pub variable_meta: bool,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct AdditionalLinks {
    pub external_url: Option<String>,
    pub telegram: Option<String>,
    pub xcom: Option<String>,
    pub medium: Option<String>,
    pub discord: Option<String>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct TokenInfo {
    pub token_owner: ActorId,
    pub approval: Option<ActorId>,
    pub sellable: bool,
    pub collection_owner: ActorId,
    pub royalty: u16,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct NftState {
    pub tokens: Vec<(NftId, NftData)>,
    pub owners: Vec<(ActorId, Vec<NftId>)>,
    pub token_approvals: Vec<(NftId, ActorId)>,
    pub config: Config,
    pub nonce: NftId,
    pub img_links_and_data: Vec<(String, ImageData)>,
    pub collection_owner: ActorId,
    pub total_number_of_tokens: Option<u64>,
    pub permission_to_mint: Option<Vec<ActorId>>,
    pub marketplace_address: ActorId,
    pub admins: Vec<ActorId>,
}

impl From<&Storage> for NftState {
    fn from(value: &Storage) -> Self {
        let Storage {
            tokens,
            owners,
            token_approvals,
            config,
            nonce,
            img_links_and_data,
            collection_owner,
            total_number_of_tokens,
            permission_to_mint,
            marketplace_address,
            admins,
            ..
        } = value;

        let tokens = tokens.clone().into_iter().collect();
        let owners = owners
            .clone()
            .into_iter()
            .map(|(actor_id, token_set)| (actor_id, token_set.into_iter().collect()))
            .collect();
        let token_approvals = token_approvals.clone().into_iter().collect();
        let admins = admins.clone().into_iter().collect();

        Self {
            tokens,
            owners,
            token_approvals,
            config: config.clone(),
            nonce: *nonce,
            img_links_and_data: img_links_and_data.to_vec(),
            collection_owner: *collection_owner,
            total_number_of_tokens: *total_number_of_tokens,
            permission_to_mint: permission_to_mint.clone(),
            marketplace_address: *marketplace_address,
            admins,
        }
    }
}

pub fn panic(err: impl Debug) -> ! {
    ext::panic_bytes(format!("{err:?}").as_bytes())
}

pub fn check_available_amount_of_tokens(storage: &Storage) {
    if storage.img_links_and_data.is_empty() {
        panic("All tokens are minted");
    }
}

pub fn check_admin(msg_src: ActorId, storage: &Storage) {
    if !storage.admins.contains(&msg_src) {
        panic("Access denied");
    }
}
pub fn check_variable_meta(storage: &Storage) {
    if !storage.config.variable_meta {
        panic("Access denied");
    }
}

pub fn check_mint(user: &ActorId, storage: &Storage) {
    if let Some(permission_to_mint) = &storage.permission_to_mint {
        if !permission_to_mint.contains(user) {
            panic("Access denied");
        }
    }

    if let Some(limit) = storage.config.user_mint_limit {
        if let Some(number_tokens) = storage.restriction_mint.get(user) {
            if number_tokens >= &limit && storage.collection_owner != *user {
                panic("Exhausted limit");
            }
        }
    }
}

// Checking for sufficient mint value and sending the value to the creator
pub fn payment_for_mint(msg_value: u128, storage: &Storage) {
    if storage.config.payment_for_mint != 0 {
        if msg_value != storage.config.payment_for_mint {
            panic("Wrong value");
        }
        // use send_with_gas to transfer the value directly to the balance, not to the mailbox.
        msg::send_with_gas(
            storage.collection_owner,
            (),
            0,
            storage.config.payment_for_mint,
        )
        .expect("Error in sending value");
    }
}
// verification of approval
pub fn can_approve(token_id: &NftId, storage: &Storage) {
    if storage.token_approvals.contains_key(token_id) {
        panic("There is approval");
    }
    let nft_info = storage.tokens.get(token_id).expect("Token does not exist");

    if nft_info.owner != msg::source() {
        panic("Access denied");
    }
}

// approval check
pub fn check_approve(user: &ActorId, token_id: &NftId, storage: &Storage) {
    let approved_account = storage
        .token_approvals
        .get(token_id)
        .expect("Access denied");

    if approved_account != user {
        panic("Access denied");
    }
}

// doing all the checks to verify that the transfer can be made
pub fn can_transfer(from: &ActorId, to: &ActorId, token_id: &NftId, storage: &Storage) {
    let nft = storage.tokens.get(token_id).expect("Token does not exist");

    let owner = nft.owner;
    if owner != *from {
        panic("Access denied");
    }
    let msg_src = msg::source();
    // if the owner of the token does not match the sender of the message, then check the approval
    if owner != msg_src {
        check_approve(&msg_src, token_id, storage);
    }
    let time = storage.config.transferable.expect("Not transferable");
    if exec::block_timestamp() < nft.mint_time + time {
        panic("Not transferable");
    }

    if from == to {
        panic("Access denied");
    }
}

pub fn sum_limit_copies(img_links_and_data: &[(String, ImageData)]) -> Option<u64> {
    img_links_and_data.iter().try_fold(0, |acc, (_, img_data)| {
        img_data.limit_copies.map(|y| acc + y as u64)
    })
}

pub fn get_random_value(range: u64) -> u64 {
    let seed = unsafe { SEED };
    unsafe { SEED = SEED.wrapping_add(1) };
    let mut random_input: [u8; 32] = exec::program_id().into();
    let block_time = exec::block_timestamp() as u8;
    random_input[0] = random_input[0].wrapping_add(seed).wrapping_add(block_time);
    let (random, _) = exec::random(random_input).expect("Error in getting random number");
    let mut result: u64 = 0;

    for &byte in &random {
        result = (result << 8) | u64::from(byte);
    }

    result % range
}
