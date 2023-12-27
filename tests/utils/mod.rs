use gstd::{ActorId, CodeId};
use gtest::{Program, RunResult, System};
use nft_io::{Config, ImageData, NftInit};
use nft_marketplace_io::{NftMarketplaceAction, NftMarketplaceInit, Offer};

mod common;
pub mod prelude;

pub use common::initialize_system;

pub const ADMINS: [u64; 2] = [123, 321];

pub fn init_marketplace(sys: &System) {
    let marketplace = Program::current(sys);
    let init_payload = NftMarketplaceInit {
        gas_for_creation: 1_000_000_000_000_000,
        gas_for_transfer_token: 5_000_000_000,
        gas_for_close_auction: 10_000_000_000,
        gas_for_delete_collection: 5_000_000_000,
        gas_for_get_token_info: 5_000_000_000,
        time_between_create_collections: 3_600_000, // 1 hour in milliseconds
        minimum_transfer_value: 10_000_000_000_000,
        ms_in_block: 3_000,
    };
    let res = marketplace.send(ADMINS[0], init_payload);
    assert!(!res.main_failed());
}

pub fn add_new_collection(
    marketplace: &Program,
    admin: u64,
    code_id: CodeId,
    type_name: String,
) -> RunResult {
    let type_description = String::from("My Collection");
    let meta_link = String::from("My Meta");

    marketplace.send(
        admin,
        NftMarketplaceAction::AddNewCollection {
            code_id,
            meta_link,
            type_name,
            type_description,
        },
    )
}

pub fn create_collection(
    marketplace: &Program,
    user: u64,
    type_name: String,
    payload: Vec<u8>,
) -> RunResult {
    marketplace.send(
        user,
        NftMarketplaceAction::CreateCollection { type_name, payload },
    )
}

pub fn sale(
    marketplace: &Program,
    user: u64,
    collection_address: ActorId,
    token_id: u64,
    price: u128,
) -> RunResult {
    marketplace.send(
        user,
        NftMarketplaceAction::SaleNft {
            collection_address,
            token_id,
            price,
        },
    )
}
pub fn cancel_sale(
    marketplace: &Program,
    user: u64,
    collection_address: ActorId,
    token_id: u64,
) -> RunResult {
    marketplace.send(
        user,
        NftMarketplaceAction::CancelSaleNft {
            collection_address,
            token_id,
        },
    )
}
pub fn create_auction(
    marketplace: &Program,
    user: u64,
    collection_address: ActorId,
    token_id: u64,
    min_price: u128,
    duration_ms: u32,
) -> RunResult {
    marketplace.send(
        user,
        NftMarketplaceAction::CreateAuction {
            collection_address,
            token_id,
            min_price,
            duration_ms,
        },
    )
}
pub fn cancel_auction(
    marketplace: &Program,
    user: u64,
    collection_address: ActorId,
    token_id: u64,
) -> RunResult {
    marketplace.send(
        user,
        NftMarketplaceAction::CancelAuction {
            collection_address,
            token_id,
        },
    )
}
pub fn add_bid(
    marketplace: &Program,
    user: u64,
    collection_address: ActorId,
    token_id: u64,
    price: u128,
) -> RunResult {
    marketplace.send_with_value(
        user,
        NftMarketplaceAction::AddBid {
            collection_address,
            token_id,
        },
        price,
    )
}
pub fn buy(
    marketplace: &Program,
    user: u64,
    collection_address: ActorId,
    token_id: u64,
    price: u128,
) -> RunResult {
    marketplace.send_with_value(
        user,
        NftMarketplaceAction::BuyNft {
            collection_address,
            token_id,
        },
        price,
    )
}

pub fn create_offer(
    marketplace: &Program,
    user: u64,
    collection_address: ActorId,
    token_id: u64,
    value: u128,
) -> RunResult {
    marketplace.send_with_value(
        user,
        NftMarketplaceAction::CreateOffer {
            collection_address,
            token_id,
        },
        value,
    )
}

pub fn accept_offer(
    marketplace: &Program,
    user: u64,
    collection_address: ActorId,
    token_id: u64,
    creator: ActorId,
) -> RunResult {
    let offer = Offer {
        collection_address,
        token_id,
        creator,
    };
    marketplace.send(user, NftMarketplaceAction::AcceptOffer { offer })
}

pub fn add_admin(marketplace: &Program, admin: u64, users: Vec<ActorId>) -> RunResult {
    marketplace.send(admin, NftMarketplaceAction::AddAdmins { users })
}

pub fn update_config(
    marketplace: &Program,
    admin: u64,
    gas_for_creation: Option<u64>,
    gas_for_transfer_token: Option<u64>,
    gas_for_close_auction: Option<u64>,
    gas_for_delete_collection: Option<u64>,
    gas_for_get_token_info: Option<u64>,
    time_between_create_collections: Option<u64>,
    minimum_transfer_value: Option<u128>,
    ms_in_block: Option<u32>,
) -> RunResult {
    marketplace.send(
        admin,
        NftMarketplaceAction::UpdateConfig {
            gas_for_creation,
            gas_for_transfer_token,
            gas_for_close_auction,
            gas_for_delete_collection,
            gas_for_get_token_info,
            time_between_create_collections,
            minimum_transfer_value,
            ms_in_block,
        },
    )
}

pub fn delete_collection(
    marketplace: &Program,
    admin: u64,
    collection_address: ActorId,
) -> RunResult {
    marketplace.send(
        admin,
        NftMarketplaceAction::DeleteCollection { collection_address },
    )
}
pub fn delete_admin(marketplace: &Program, admin: u64, user: ActorId) -> RunResult {
    marketplace.send(admin, NftMarketplaceAction::DeleteAdmin { user })
}
pub fn check_payload(log_number: usize, result: &RunResult, message: String) -> bool {
    result.log()[log_number]
        .payload()
        .windows(message.as_bytes().len())
        .any(|window| window == message.as_bytes())
}

pub fn get_init_nft_payload(
    collection_owner: ActorId,
    royalty: u16,
    user_mint_limit: Option<u32>,
    payment_for_mint: u128,
) -> NftInit {
    let img_data = ImageData {
        limit_copies: Some(1),
        auto_changing_rules: None,
    };
    let img_links: Vec<(String, ImageData)> = (0..10)
        .map(|i| (format!("Img-{}", i), img_data.clone()))
        .collect();

    NftInit {
        collection_owner,
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_banner: "Collection banner".to_string(),
            collection_logo: "Collection logo".to_string(),
            collection_tags: vec!["tag1".to_string()],
            additional_links: None,
            royalty,
            user_mint_limit,
            payment_for_mint,
            transferable: Some(0),
            sellable: Some(0),
        },
        img_links,
    }
}
// pub fn get_state(
//     marketplace: &Program,
//     admin: u64,
//     code_id: CodeId

// ) -> Option<VaraManState> {

//     let reply = self
//         .read_state(StateQuery::All)
//         .expect("Unexpected invalid state.");
//     if let StateReply::All(state) = reply {
//         Some(state)
//     } else {
//         None
//     }
// }
