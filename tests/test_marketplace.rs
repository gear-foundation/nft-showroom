use crate::utils::{add_new_collection, init_marketplace, create_collection, add_admin, update_config, delete_collection, delete_admin};
use utils::{prelude::*};
mod utils;
use nft_marketplace_io::*;
use nft_io::{NftInit, Config as ConfigNft};

const USERS: &[u64] = &[5, 6, 7];

#[test]
fn create_success() {
    let sys = utils::initialize_system();
    init_marketplace(&sys);
    let marketplace = sys.get_program(1);
    let nft_collection_code_id =
        sys.submit_code("target/wasm32-unknown-unknown/debug/nft.opt.wasm");

    let state_reply = marketplace.read_state(StateQuery::CollectionsInfo).expect("Unexpected invalid state.");
    if let StateReply::CollectionsInfo(state) = state_reply {
        assert!(state.is_empty(), "Collection info should be empty");
        println!("Collection info: {:?}", state);
    }
    // Сreating a new type of collection 
    let res = add_new_collection(&marketplace, ADMINS[0], nft_collection_code_id.into_bytes().into());
    assert!(!res.main_failed());
    let state_reply = marketplace.read_state(StateQuery::CollectionsInfo).expect("Unexpected invalid state.");
    if let StateReply::CollectionsInfo(state) = state_reply {
        assert!(!state.is_empty(), "Collection info shouldn't be empty");
        assert_eq!(state[0].1.collection_id, 1,  "Collection id should be equal by 0");
        println!("Collection info: {:?}", state);
    }

    // Add admin
    let users: Vec<ActorId> = vec![100.into(), 101.into()];
    let res = add_admin(&marketplace, ADMINS[0], users);
    assert!(!res.main_failed());
    let state_reply = marketplace.read_state(StateQuery::Admins).expect("Unexpected invalid state.");
    if let StateReply::Admins(admins) = state_reply {
        assert_eq!(admins, vec![123.into(), 100.into(), 101.into()] ,  "Wrong admins");
    }

    // Delete admin
    let res = delete_admin(&marketplace, ADMINS[0], 100.into());
    assert!(!res.main_failed());
    let state_reply = marketplace.read_state(StateQuery::Admins).expect("Unexpected invalid state.");
    if let StateReply::Admins(admins) = state_reply {
        assert_eq!(admins, vec![123.into(), 101.into()] ,  "Wrong admins");
    }

    // Update config
    let res = update_config(&marketplace, ADMINS[0], 2_000_000_000_000_000, 7_200_000);
    assert!(!res.main_failed());
    let state_reply = marketplace.read_state(StateQuery::Config).expect("Unexpected invalid state.");
    if let StateReply::Config(config) = state_reply {
        assert_eq!(config.gas_for_creation, 2_000_000_000_000_000,  "Wrong config");
        assert_eq!(config.time_between_create_collections, 7_200_000,  "Wrong config");
        println!("CONFIG: {:?}", config);
    }

    let img_links: Vec<(String, u128)> = (0..10)
        .map(|i| (format!("Img-{}", i), 1 as u128))
        .collect();

    let init_nft_payload = NftInit{
        owner: USERS[0].into(),
        config: ConfigNft {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            mint_limit: 3.into(),
            transferable: true,
            approvable: true,
            burnable: true,
        },
        img_links,
    };

    // Create collection 
    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(!res.main_failed());
    let state_reply = marketplace.read_state(StateQuery::AllCollections).expect("Unexpected invalid state.");
    if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state[0].0, USERS[0].into(), "Wrong owner of collection");
    }
    sys.spend_blocks(7200);
    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(!res.main_failed());
    let state_reply = marketplace.read_state(StateQuery::AllCollections).expect("Unexpected invalid state.");
    if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state[0].1.len(), 2, "The number of collection is wrong");
    }

    // Delete type of collection 
    let res = delete_collection(&marketplace, ADMINS[0], 1);
    assert!(!res.main_failed());
    let state_reply = marketplace.read_state(StateQuery::CollectionsInfo).expect("Unexpected invalid state.");
    if let StateReply::CollectionsInfo(state) = state_reply {
        assert!(state.is_empty(), "Collection info should be empty");
    }


}

#[test]
fn create_failures() {
    let sys = utils::initialize_system();
    init_marketplace(&sys);
    let marketplace = sys.get_program(1);
    let nft_collection_code_id =
        sys.submit_code("target/wasm32-unknown-unknown/debug/nft.opt.wasm");

    let state_reply = marketplace.read_state(StateQuery::CollectionsInfo).expect("Unexpected invalid state.");
    if let StateReply::CollectionsInfo(state) = state_reply {
        assert!(state.is_empty(), "Collection info should be empty");
        println!("Collection info: {:?}", state);
    }
    // not admin
    let res = add_new_collection(&marketplace, USERS[0], nft_collection_code_id.into_bytes().into());
    assert!(res.main_failed());
    let res = add_admin(&marketplace, USERS[0], vec![100.into()]);
    assert!(res.main_failed());
    let res = update_config(&marketplace, USERS[0], 2_000_000_000_000_000, 7_200_000);
    assert!(res.main_failed());

    // Сan only create one collection per hour
    let res = add_new_collection(&marketplace, ADMINS[0], nft_collection_code_id.into_bytes().into());
    assert!(!res.main_failed());
    let img_links: Vec<(String, u128)> = (0..10)
        .map(|i| (format!("Img-{}", i), 1 as u128))
        .collect();


    let init_nft_payload = NftInit{
        owner: USERS[0].into(),
        config: ConfigNft {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            mint_limit: 3.into(),
            transferable: true,
            approvable: true,
            burnable: true,
        },
        img_links,
    };

    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(!res.main_failed());
    sys.spend_blocks(3500); // less than 3,600
    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(res.main_failed());



}
