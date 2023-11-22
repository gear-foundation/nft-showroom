use gstd::{CodeId, ActorId};
use gtest::{Program, RunResult, System};
use nft_marketplace_io::{NftMarketplaceAction, NftMarketplaceInit, Config};

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
    let description = String::from("My Collection");
    let meta_link = String::from("My Meta");

    marketplace.send(
        admin,
        NftMarketplaceAction::AddNewCollection {
            code_id,
            meta_link,
            description,
        },
    )
}

pub fn create_collection(
    marketplace: &Program,
    user: u64,
    id_collection: u128,
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

pub fn add_admin(
    marketplace: &Program,
    admin: u64,
    users: Vec<ActorId>,
) -> RunResult {
    marketplace.send(
        admin,
        NftMarketplaceAction::AddAdmin {
            users
        },
    )
}

pub fn update_config(
    marketplace: &Program,
    admin: u64,
    gas_for_creation: u64,
    time_between_create_collections: u64,
) -> RunResult {
    let config = Config{
        gas_for_creation,
        time_between_create_collections
    };
    marketplace.send(
        admin,
        NftMarketplaceAction::UpdateConfig {
            config
        }
    )
}

pub fn delete_collection(
    marketplace: &Program,
    admin: u64,
    id_collection: u128,

) -> RunResult {
    marketplace.send(
        admin,
        NftMarketplaceAction::DeleteCollection { 
            id_collection
        }
    )
}
pub fn delete_admin(
    marketplace: &Program,
    admin: u64,
    user: ActorId,

) -> RunResult {
    marketplace.send(
        admin,
        NftMarketplaceAction::DeleteAdmin {
            user
        } 
    )
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
