use crate::utils::*;
use utils::prelude::*;
mod utils;
use nft_io::{
    Config as ConfigNft, NftInit, StateQuery as StateQueryNft, StateReply as StateReplyNft,
};
use nft_marketplace_io::*;

const USERS: &[u64] = &[5, 6, 7];

#[test]
fn create_success() {
    let sys = utils::initialize_system();
    init_marketplace(&sys);
    let marketplace = sys.get_program(1);
    let nft_collection_code_id =
        sys.submit_code("target/wasm32-unknown-unknown/debug/nft.opt.wasm");

    let state_reply = marketplace
        .read_state(StateQuery::CollectionsInfo)
        .expect("Unexpected invalid state.");
    if let StateReply::CollectionsInfo(state) = state_reply {
        assert!(state.is_empty(), "Collection info should be empty");
        println!("Collection info: {:?}", state);
    }
    // Сreating a new type of collection
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
    );
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::CollectionsInfo)
        .expect("Unexpected invalid state.");
    if let StateReply::CollectionsInfo(state) = state_reply {
        assert!(!state.is_empty(), "Collection info shouldn't be empty");
        // assert_eq!(state[0].1.collection_id, 1,  "Collection id should be equal by 0");
        println!("Collection info: {:?}", state);
    }

    // Add admin
    let users: Vec<ActorId> = vec![100.into(), 101.into()];
    let res = add_admin(&marketplace, ADMINS[0], users);
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::Admins)
        .expect("Unexpected invalid state.");
    if let StateReply::Admins(admins) = state_reply {
        assert_eq!(
            admins,
            vec![123.into(), 100.into(), 101.into()],
            "Wrong admins"
        );
    }

    // Delete admin
    let res = delete_admin(&marketplace, ADMINS[0], 100.into());
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::Admins)
        .expect("Unexpected invalid state.");
    if let StateReply::Admins(admins) = state_reply {
        assert_eq!(admins, vec![123.into(), 101.into()], "Wrong admins");
    }

    // Update config
    let res = update_config(
        &marketplace,
        ADMINS[0],
        Some(200_000_000_000),
        Some(7_200_000),
    );
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::Config)
        .expect("Unexpected invalid state.");
    if let StateReply::Config(config) = state_reply {
        assert_eq!(config.gas_for_creation, 200_000_000_000, "Wrong config");
        assert_eq!(
            config.time_between_create_collections, 7_200_000,
            "Wrong config"
        );
        println!("CONFIG: {:?}", config);
    }

    let img_links: Vec<(String, u32)> = (0..10).map(|i| (format!("Img-{}", i), 1 as u32)).collect();

    let init_nft_payload = NftInit {
        owner: USERS[0].into(),
        config: ConfigNft {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            mint_limit: 3.into(),
            transferable: true,
            approvable: true,
            burnable: true,
            sellable: true,
        },
        img_links,
    };

    // Create collection
    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state[0].0, USERS[0].into(), "Wrong owner of collection");
    }
    sys.spend_blocks(7200);
    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state[0].1.len(), 2, "The number of collection is wrong");
    }

    // Delete type of collection
    let res = delete_collection(&marketplace, ADMINS[0], 1);
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::CollectionsInfo)
        .expect("Unexpected invalid state.");
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

    let state_reply = marketplace
        .read_state(StateQuery::CollectionsInfo)
        .expect("Unexpected invalid state.");
    if let StateReply::CollectionsInfo(state) = state_reply {
        assert!(state.is_empty(), "Collection info should be empty");
        println!("Collection info: {:?}", state);
    }
    // not admin
    let res = add_new_collection(
        &marketplace,
        USERS[0],
        nft_collection_code_id.into_bytes().into(),
    );
    assert!(res.main_failed());
    let res = add_admin(&marketplace, USERS[0], vec![100.into()]);
    assert!(res.main_failed());
    let res = update_config(
        &marketplace,
        USERS[0],
        Some(200_000_000_000),
        Some(7_200_000),
    );
    assert!(res.main_failed());

    // Сan only create one collection per hour
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
    );
    assert!(!res.main_failed());
    let img_links: Vec<(String, u32)> = (0..10).map(|i| (format!("Img-{}", i), 1 as u32)).collect();

    let init_nft_payload = NftInit {
        owner: USERS[0].into(),
        config: ConfigNft {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            mint_limit: 3.into(),
            transferable: true,
            approvable: true,
            burnable: true,
            sellable: true,
        },
        img_links,
    };

    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(!res.main_failed());
    sys.spend_blocks(3500); // less than 3,600
    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(res.main_failed());
}

#[test]
fn sale_success() {
    let sys = utils::initialize_system();
    init_marketplace(&sys);
    let marketplace = sys.get_program(1);
    let nft_collection_code_id =
        sys.submit_code("target/wasm32-unknown-unknown/debug/nft.opt.wasm");

    let state_reply = marketplace
        .read_state(StateQuery::CollectionsInfo)
        .expect("Unexpected invalid state.");
    if let StateReply::CollectionsInfo(state) = state_reply {
        assert!(state.is_empty(), "Collection info should be empty");
        println!("Collection info: {:?}", state);
    }
    // Сreating a new type of collection
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
    );
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::CollectionsInfo)
        .expect("Unexpected invalid state.");
    if let StateReply::CollectionsInfo(state) = state_reply {
        assert!(!state.is_empty(), "Collection info shouldn't be empty");
        // assert_eq!(state[0].1.collection_id, 1,  "Collection id should be equal by 0");
        println!("Collection info: {:?}", state);
    }

    // Create collection
    let img_links: Vec<(String, u32)> = (0..10).map(|i| (format!("Img-{}", i), 1 as u32)).collect();

    let init_nft_payload = NftInit {
        owner: USERS[0].into(),
        config: ConfigNft {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            mint_limit: 3.into(),
            transferable: true,
            approvable: true,
            burnable: true,
            sellable: true,
        },
        img_links,
    };

    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    let address_nft = if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state[0].0, USERS[0].into(), "Wrong owner of collection");
        state[0].1[0]
    } else {
        assert!(false, "Unexpected StateReply variant");
        0.into()
    };

    let address_nft_2: [u8; 32] = address_nft.into();
    let nft_collection = sys.get_program(address_nft_2);

    // Successful mint NFT in the new collection
    let res = nft_collection.send(USERS[1], nft_io::NftAction::Mint);
    assert!(!res.main_failed());

    // Successful approve NFT in the collection
    let addres_marketplace: [u8; 32] = marketplace.id().into();
    let res = nft_collection.send(
        USERS[1],
        nft_io::NftAction::Approve {
            to: addres_marketplace.into(),
            token_id: 0,
        },
    );
    assert!(!res.main_failed());

    let res = sale(&marketplace, USERS[1], address_nft, 0, 11_000_000_000_000);
    assert!(!res.main_failed());

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        println!("STATE: {:?}", state);
    }

    sys.mint_to(USERS[2], 11_000_000_000_000);
    // sys.mint_to(1, 100_000_000_000_000);
    let res = buy(&marketplace, USERS[2], address_nft, 0, 11_000_000_000_000);
    assert!(!res.main_failed());

    sys.claim_value_from_mailbox(USERS[1]);

    let balance = sys.balance_of(USERS[1]);
    assert_eq!(balance, 11_000_000_000_000, "Wrong balance");

    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");

    if let StateReplyNft::All(state) = state_reply {
        println!("STATE: {:?}", state);
        let token = state.tokens.get(0).expect("Can't be None");
        assert_eq!(token.0, 0);
        assert_eq!(token.1.owner, USERS[2].into())
    }
}
