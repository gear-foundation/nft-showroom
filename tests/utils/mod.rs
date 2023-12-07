use gstd::{ActorId, CodeId};
use gtest::{Program, RunResult, System};
use nft_marketplace_io::{NftMarketplaceAction, NftMarketplaceInit};

mod common;
pub mod prelude;

pub use common::initialize_system;

pub const ADMINS: [u64; 2] = [123, 321];

pub fn init_marketplace(sys: &System) {
    let marketplace = Program::current(sys);
    let init_payload = NftMarketplaceInit {
        gas_for_creation: 1_000_000_000_000_000,
        time_between_create_collections: 3_600_000, // 1 hour in milliseconds
    };
    let res = marketplace.send(ADMINS[0], init_payload);
    assert!(!res.main_failed());
}

pub fn add_new_collection(marketplace: &Program, admin: u64, code_id: CodeId) -> RunResult {
    let type_description = String::from("My Collection");
    let meta_link = String::from("My Meta");

    marketplace.send(
        admin,
        NftMarketplaceAction::AddNewCollection {
            code_id,
            meta_link,
            type_description,
        },
    )
}

pub fn create_collection(
    marketplace: &Program,
    user: u64,
    id_collection: u16,
    payload: Vec<u8>,
) -> RunResult {
    marketplace.send(
        user,
        NftMarketplaceAction::CreateCollection {
            id_collection,
            payload,
        },
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

pub fn add_admin(marketplace: &Program, admin: u64, users: Vec<ActorId>) -> RunResult {
    marketplace.send(admin, NftMarketplaceAction::AddAdmins { users })
}

pub fn update_config(
    marketplace: &Program,
    admin: u64,
    gas_for_creation: Option<u64>,
    time_between_create_collections: Option<u64>,
) -> RunResult {
    marketplace.send(
        admin,
        NftMarketplaceAction::UpdateConfig {
            gas_for_creation,
            time_between_create_collections,
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
