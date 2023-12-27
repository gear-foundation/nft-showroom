use crate::utils::*;
use utils::prelude::*;
mod utils;
use nft_io::{StateQuery as StateQueryNft, StateReply as StateReplyNft};
use nft_marketplace_io::*;

const USERS: &[u64] = &[5, 6, 7, 8];

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
    let name_simple_nft = "Simple NFT".to_string();
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
        name_simple_nft.clone(),
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
        None,
        None,
        None,
        None,
        Some(7_200_000),
        Some(11_000_000_000_000),
        None,
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

    let init_nft_payload = get_init_nft_payload(USERS[0].into(), 0, Some(3), 0);

    // Create collection
    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state[0].1, USERS[0].into(), "Wrong owner of collection");
    }
    sys.spend_blocks(7200);
    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state.len(), 2, "The number of collection is wrong");
    }

    // Delete collection
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    let address_nft = if let StateReply::AllCollections(state) = state_reply {
        state[0].0
    } else {
        assert!(false, "Unexpected StateReply variant");
        0.into()
    };
    let res = delete_collection(&marketplace, ADMINS[0], address_nft);
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    if let StateReply::AllCollections(state) = state_reply {
        assert_eq!(state.len(), 1, "The number of collection is wrong");
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
    let name_simple_nft = "Simple NFT".to_string();
    let res = add_new_collection(
        &marketplace,
        USERS[0],
        nft_collection_code_id.into_bytes().into(),
        name_simple_nft.clone(),
    );

    assert!(check_payload(
        0,
        &res,
        "Only admin can send this message".to_string()
    ));

    let res = add_admin(&marketplace, USERS[0], vec![100.into()]);
    assert!(check_payload(
        0,
        &res,
        "Only admin can send this message".to_string()
    ));

    let res = update_config(
        &marketplace,
        USERS[0],
        Some(200_000_000_000),
        None,
        None,
        None,
        None,
        Some(7_200_000),
        Some(11_000_000_000_000),
        None,
    );
    assert!(check_payload(
        0,
        &res,
        "Only admin can send this message".to_string()
    ));

    // Add type of collection
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
        name_simple_nft.clone(),
    );
    assert!(!res.main_failed());

    let init_nft_payload = get_init_nft_payload(USERS[0].into(), 0, Some(3), 0);

    // Сan only create one collection per hour
    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(!res.main_failed());
    sys.spend_blocks(1100); // less than 3,600
    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(check_payload(
        0,
        &res,
        "The time limit for creating a collection has not yet expired.".to_string()
    ));

    // Delete collection
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    let address_nft = if let StateReply::AllCollections(state) = state_reply {
        state[0].0
    } else {
        assert!(false, "Unexpected StateReply variant");
        0.into()
    };
    let res = delete_collection(&marketplace, USERS[0], 1.into());
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "There is no collection with that address".to_string()
    ));
    let res = delete_collection(&marketplace, USERS[1], address_nft);
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "Only the owner of the collection can send this message".to_string()
    ));

    // Mint token
    let address_nft_array: [u8; 32] = address_nft.into();
    let nft_collection = sys.get_program(address_nft_array);

    // Successful mint NFT in the new collection
    let res = nft_collection.send(USERS[1], nft_io::NftAction::Mint);
    assert!(!res.main_failed());

    let res = delete_collection(&marketplace, USERS[0], address_nft);
    assert!(!res.main_failed());
    assert!(check_payload(0, &res, "Removal denied".to_string()));
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
    let name_simple_nft = "Simple NFT".to_string();
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
        name_simple_nft.clone(),
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
    let royalty = 1_000;
    let init_nft_payload = get_init_nft_payload(USERS[0].into(), royalty, Some(3), 0);

    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    let address_nft = if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state[0].1, USERS[0].into(), "Wrong owner of collection");
        state[0].0
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

    let price = 150_000_000_000_000;

    let res = sale(&marketplace, USERS[1], address_nft, 0, price);
    assert!(!res.main_failed());

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        assert!(!state.sales.is_empty());
        println!("STATE: {:?}", state);
    }

    sys.mint_to(USERS[2], price);
    // sys.mint_to(1, 100_000_000_000_000);
    let res = buy(&marketplace, USERS[2], address_nft, 0, price);
    assert!(!res.main_failed());

    let percent_to_collection_owner = price * royalty as u128 / 10_000;
    sys.claim_value_from_mailbox(USERS[1]);
    let balance = sys.balance_of(USERS[1]);
    assert_eq!(
        balance,
        price - percent_to_collection_owner,
        "Wrong balance"
    );

    sys.claim_value_from_mailbox(USERS[0]);
    let balance = sys.balance_of(USERS[0]);
    assert_eq!(balance, percent_to_collection_owner, "Wrong balance");

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

#[test]
fn sale_failures() {
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
    let name_simple_nft = "Simple NFT".to_string();
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
        name_simple_nft.clone(),
    );
    assert!(!res.main_failed());

    // Create collection
    let royalty = 1_000;
    let init_nft_payload = get_init_nft_payload(USERS[0].into(), royalty, Some(3), 0);

    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    let address_nft = if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state[0].1, USERS[0].into(), "Wrong owner of collection");
        state[0].0
    } else {
        assert!(false, "Unexpected StateReply variant");
        0.into()
    };

    let address_nft_2: [u8; 32] = address_nft.into();
    let nft_collection = sys.get_program(address_nft_2);

    // Successful mint NFT in the new collection
    let res = nft_collection.send(USERS[1], nft_io::NftAction::Mint);
    assert!(!res.main_failed());

    // low price
    let res = sale(&marketplace, USERS[1], address_nft, 0, 9_000_000_000_000);
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "The price must be greater than existential deposit (10000000000000)".to_string()
    ));

    // Only owner can send this action
    let price = 150_000_000_000_000;
    let res = sale(&marketplace, USERS[2], address_nft, 0, price);
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "Only the owner of the token can perform this action.".to_string()
    ));

    // No approve to the marketplace
    let res = sale(&marketplace, USERS[1], address_nft, 0, price);
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "No approve to the marketplace".to_string()
    ));

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

    // Success
    let res = sale(&marketplace, USERS[1], address_nft, 0, price);
    assert!(!res.main_failed());

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        assert!(!state.sales.is_empty());
    }

    // is already on sale
    let res = sale(&marketplace, USERS[1], address_nft, 0, price);
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "This nft is already on sale.".to_string()
    ));

    // wrong owner
    let res = cancel_sale(&marketplace, USERS[2], address_nft, 0);
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "Only the nft owner can cancel the sale.".to_string()
    ));
    // Wrong token_id
    let res = cancel_sale(&marketplace, USERS[1], address_nft, 1);
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "This sale does not exist. Wrong collection_address or token_id".to_string()
    ));

    // value is less than the price
    sys.mint_to(USERS[2], price);
    let balance = sys.balance_of(1);
    println!("BALANCE {:?}", balance);

    let res = buy(&marketplace, USERS[2], address_nft, 0, price - 1);
    assert!(!res.main_failed());
    assert!(check_payload(
        1,
        &res,
        "The specified value is less than the price of the token".to_string()
    ));

    let balance = sys.balance_of(1);
    println!("BALANCE {:?}", balance);

    sys.claim_value_from_mailbox(USERS[2]);
    let balance = sys.balance_of(USERS[2]);
    assert_eq!(balance, price - 1, "Wrong balance");

    // Wrong collection_address or token_id.
    let res = buy(&marketplace, USERS[2], address_nft, 1, price - 1);
    assert!(!res.main_failed());

    assert!(check_payload(
        0,
        &res,
        "Wrong collection_address or token_id.".to_string()
    ));
}

#[test]
fn auction_success() {
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
    let name_simple_nft = "Simple NFT".to_string();
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
        name_simple_nft.clone(),
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

    let royalty = 1_000;
    let init_nft_payload = get_init_nft_payload(USERS[0].into(), royalty, Some(3), 0);

    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    let address_nft = if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state[0].1, USERS[0].into(), "Wrong owner of collection");
        state[0].0
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

    let duration_ms = 10_000;
    let duration_blocks = duration_ms / 3000 + 1;
    let res = create_auction(
        &marketplace,
        USERS[1],
        address_nft,
        0,
        10_000_000_000_000,
        duration_ms,
    );
    let result = &res.decoded_log::<Result<NftMarketplaceEvent, NftMarketplaceError>>()[0];
    println!("RES: {:?}", result);
    assert!(!res.main_failed());

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        println!("STATE: {:?}", state);
    }

    let current_balance = 200_000_000_000_000;
    sys.mint_to(USERS[2], current_balance);
    sys.mint_to(USERS[3], current_balance);

    let res = add_bid(&marketplace, USERS[2], address_nft, 0, 100_000_000_000_000);
    assert!(!res.main_failed());
    let balance = sys.balance_of(USERS[2]);
    assert_eq!(balance, 100_000_000_000_000, "Wrong balance");

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        assert_eq!(state.auctions[0].1.current_winner, USERS[2].into());
        println!("STATE: {:?}", state);
    }

    let final_bid = 150_000_000_000_000;
    let res = add_bid(&marketplace, USERS[3], address_nft, 0, final_bid);
    assert!(!res.main_failed());
    let balance = sys.balance_of(USERS[3]);
    assert_eq!(balance, current_balance - final_bid, "Wrong balance");
    sys.claim_value_from_mailbox(USERS[2]);
    let balance = sys.balance_of(USERS[2]);
    assert_eq!(balance, current_balance, "Wrong balance");

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        assert_eq!(state.auctions[0].1.current_winner, USERS[3].into());
        println!("STATE: {:?}", state);
    }

    sys.spend_blocks(duration_blocks);

    let percent_to_collection_owner = final_bid * royalty as u128 / 10_000;
    sys.claim_value_from_mailbox(USERS[1]);
    let balance = sys.balance_of(USERS[1]);
    assert_eq!(
        balance,
        final_bid - percent_to_collection_owner,
        "Wrong balance"
    );

    sys.claim_value_from_mailbox(USERS[0]);
    let balance = sys.balance_of(USERS[0]);
    assert_eq!(balance, percent_to_collection_owner, "Wrong balance");

    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");

    if let StateReplyNft::All(state) = state_reply {
        println!("STATE: {:?}", state);
        let token = state.tokens.get(0).expect("Can't be None");
        assert_eq!(token.0, 0);
        assert_eq!(token.1.owner, USERS[3].into())
    }
}

#[test]
fn auction_cancel() {
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
    let name_simple_nft = "Simple NFT".to_string();
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
        name_simple_nft.clone(),
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
    let royalty = 1_000;
    let init_nft_payload = get_init_nft_payload(USERS[0].into(), royalty, Some(3), 0);

    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    let address_nft = if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state[0].1, USERS[0].into(), "Wrong owner of collection");
        state[0].0
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

    // Create auction
    let duration_ms_1 = 10_000;
    let duration_blocks_1 = duration_ms_1 / 3000 + 1;
    let res = create_auction(
        &marketplace,
        USERS[1],
        address_nft,
        0,
        10_000_000_000_000,
        duration_ms_1,
    );
    assert!(!res.main_failed());

    // Add bid
    let current_balance = 200_000_000_000_000;
    sys.mint_to(USERS[2], current_balance);

    let res = add_bid(&marketplace, USERS[2], address_nft, 0, 100_000_000_000_000);
    assert!(!res.main_failed());
    let balance = sys.balance_of(USERS[2]);
    assert_eq!(balance, 100_000_000_000_000, "Wrong balance");

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        assert_eq!(state.auctions[0].1.current_winner, USERS[2].into());
    }

    // Cancel auction
    let res = cancel_auction(&marketplace, USERS[1], address_nft, 0);
    assert!(!res.main_failed());

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        assert!(state.auctions.is_empty());
    }

    // Check balance
    sys.claim_value_from_mailbox(USERS[2]);
    let balance = sys.balance_of(USERS[2]);
    assert_eq!(balance, 200_000_000_000_000, "Wrong balance");

    // Successful approve
    let addres_marketplace: [u8; 32] = marketplace.id().into();
    let res = nft_collection.send(
        USERS[1],
        nft_io::NftAction::Approve {
            to: addres_marketplace.into(),
            token_id: 0,
        },
    );
    assert!(!res.main_failed());

    // Create the same auction
    let duration_ms_2 = 30_000;
    let duration_blocks_2 = duration_ms_2 / 3000 + 1;
    let res = create_auction(
        &marketplace,
        USERS[1],
        address_nft,
        0,
        10_000_000_000_000,
        duration_ms_2,
    );
    assert!(!res.main_failed());

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        assert!(!state.auctions.is_empty());
    }

    sys.spend_blocks(duration_blocks_1);

    // the delayed message from the first version of the auction will come,
    // but it should end with an error, because the auction was canceled and a new one was created.
    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        assert!(!state.auctions.is_empty());
    }

    sys.spend_blocks(duration_blocks_2 - duration_blocks_1);

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        assert!(state.auctions.is_empty());
    }

    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");

    if let StateReplyNft::All(state) = state_reply {
        println!("STATE: {:?}", state);
        let token = state.tokens.get(0).expect("Can't be None");
        assert_eq!(token.0, 0);
        assert_eq!(token.1.owner, USERS[1].into())
    }
}

#[test]
fn auction_failures() {
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
    let name_simple_nft = "Simple NFT".to_string();
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
        name_simple_nft.clone(),
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
    let royalty = 1_000;
    let init_nft_payload = get_init_nft_payload(USERS[0].into(), royalty, Some(3), 0);

    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    let address_nft = if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state[0].1, USERS[0].into(), "Wrong owner of collection");
        state[0].0
    } else {
        assert!(false, "Unexpected StateReply variant");
        0.into()
    };

    let address_nft_2: [u8; 32] = address_nft.into();
    let nft_collection = sys.get_program(address_nft_2);

    // Successful mint NFT in the new collection
    let res = nft_collection.send(USERS[1], nft_io::NftAction::Mint);
    assert!(!res.main_failed());

    // low price
    let duration_ms = 10_000;
    let duration_blocks = duration_ms / 3000 + 1;

    let res = create_auction(
        &marketplace,
        USERS[1],
        address_nft,
        0,
        9_000_000_000_000,
        duration_ms,
    );
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "Auction min price must be greater than existential deposit (10000000000000)".to_string()
    ));

    // Only token owner can send
    let res = create_auction(
        &marketplace,
        USERS[2],
        address_nft,
        0,
        10_000_000_000_000,
        duration_ms,
    );
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "Only the owner of the token can perform this action.".to_string()
    ));

    // No approve
    let res = create_auction(
        &marketplace,
        USERS[1],
        address_nft,
        0,
        10_000_000_000_000,
        duration_ms,
    );
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "No approve to the marketplace".to_string()
    ));

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

    // Successful create auction
    let res = create_auction(
        &marketplace,
        USERS[1],
        address_nft,
        0,
        11_000_000_000_000,
        duration_ms,
    );
    assert!(!res.main_failed());

    // No auction with this collection address and token id
    let res = cancel_auction(&marketplace, USERS[1], address_nft, 1);
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "There is no auction with this collection address and token id".to_string()
    ));

    // Only the creator of the auction can send cancel_auction
    let res = cancel_auction(&marketplace, USERS[2], address_nft, 0);
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "Only the creator of the auction can send this message".to_string()
    ));

    let current_balance = 20_000_000_000_000;
    sys.mint_to(USERS[2], current_balance);

    let res = add_bid(&marketplace, USERS[2], address_nft, 0, 10_000_000_000_000);
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "Less than or equal to the current bid rate.".to_string()
    ));
    // let balance = sys.balance_of(USERS[2]);
    // assert_eq!(balance, 100_000_000_000_000, "Wrong balance");
    sys.spend_blocks(duration_blocks);
    sys.mint_to(USERS[3], 15_000_000_000_000);
    let res = add_bid(&marketplace, USERS[3], address_nft, 0, 15_000_000_000_000);
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "There is no auction with this collection address and token id".to_string()
    ));
}

#[test]
fn offer_success() {
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
    let name_simple_nft = "Simple NFT".to_string();
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
        name_simple_nft.clone(),
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
    let royalty = 1_000;
    let init_nft_payload = get_init_nft_payload(USERS[0].into(), royalty, Some(3), 0);

    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    let address_nft = if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state[0].1, USERS[0].into(), "Wrong owner of collection");
        state[0].0
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

    let offer_price = 150_000_000_000_000;
    sys.mint_to(USERS[2], offer_price);
    let res = create_offer(&marketplace, USERS[2], address_nft, 0, offer_price);
    assert!(!res.main_failed());

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        println!("STATE: {:?}", state);
        let creator: ActorId = USERS[2].into();
        assert_eq!(creator, state.offers[0].0.creator);
        assert_eq!(offer_price, state.offers[0].1);
    }

    let res = accept_offer(&marketplace, USERS[1], address_nft, 0, USERS[2].into());
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        println!("STATE: {:?}", state);
        assert!(state.offers.is_empty());
    }

    let percent_to_collection_owner = offer_price * royalty as u128 / 10_000;
    sys.claim_value_from_mailbox(USERS[1]);
    let balance = sys.balance_of(USERS[1]);
    assert_eq!(
        balance,
        offer_price - percent_to_collection_owner,
        "Wrong balance"
    );

    sys.claim_value_from_mailbox(USERS[0]);
    let balance = sys.balance_of(USERS[0]);
    assert_eq!(balance, percent_to_collection_owner, "Wrong balance");

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

#[test]
fn offer_failures() {
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
    let name_simple_nft = "Simple NFT".to_string();
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
        name_simple_nft.clone(),
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
    let royalty = 1_000;
    let init_nft_payload = get_init_nft_payload(USERS[0].into(), royalty, Some(3), 0);

    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(!res.main_failed());
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    let address_nft = if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        assert_eq!(state[0].1, USERS[0].into(), "Wrong owner of collection");
        state[0].0
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

    let price = 150_000_000_000_000;

    let res = sale(&marketplace, USERS[1], address_nft, 0, price);
    assert!(!res.main_failed());

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        println!("STATE: {:?}", state);
    }

    let offer_price = 150_000_000_000_000;
    sys.mint_to(USERS[2], offer_price);
    let res = create_offer(&marketplace, USERS[2], address_nft, 0, offer_price);
    assert!(!res.main_failed());

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        println!("STATE: {:?}", state);
        let creator: ActorId = USERS[2].into();
        assert_eq!(creator, state.offers[0].0.creator);
        assert_eq!(offer_price, state.offers[0].1);
    }

    let res = accept_offer(&marketplace, USERS[1], address_nft, 0, USERS[2].into());
    let result = &res.decoded_log::<Result<NftMarketplaceEvent, NftMarketplaceError>>();
    println!("RES: {:?}", result);
    assert!(check_payload(
        0,
        &res,
        "This token is on sale, cancel the sale if you wish to accept the offer".to_string()
    ));
    assert!(!res.main_failed());

    let res = cancel_sale(&marketplace, USERS[1], address_nft, 0);
    let result = &res.decoded_log::<Result<NftMarketplaceEvent, NftMarketplaceError>>();
    println!("RES: {:?}", result);
    assert!(!res.main_failed());

    let res = nft_collection.send(
        USERS[1],
        nft_io::NftAction::Approve {
            to: addres_marketplace.into(),
            token_id: 0,
        },
    );
    assert!(!res.main_failed());

    let duration_ms = 10_000;
    let res = create_auction(
        &marketplace,
        USERS[1],
        address_nft,
        0,
        10_000_000_000_000,
        duration_ms,
    );
    assert!(!res.main_failed());
    let res = accept_offer(&marketplace, USERS[1], address_nft, 0, USERS[2].into());
    assert!(check_payload(
        0,
        &res,
        "This token is on auction, cancel the auction if you wish to accept the offer".to_string()
    ));
    assert!(!res.main_failed());

    let res = cancel_auction(&marketplace, USERS[1], address_nft, 0);
    assert!(!res.main_failed());

    let res = nft_collection.send(
        USERS[1],
        nft_io::NftAction::Approve {
            to: addres_marketplace.into(),
            token_id: 0,
        },
    );
    assert!(!res.main_failed());

    let res = accept_offer(&marketplace, USERS[1], address_nft, 0, USERS[2].into());
    let result = &res.decoded_log::<Result<NftMarketplaceEvent, NftMarketplaceError>>();
    println!("RES: {:?}", result);
    assert!(!res.main_failed());

    let state_reply = marketplace
        .read_state(StateQuery::All)
        .expect("Unexpected invalid state.");
    if let StateReply::All(state) = state_reply {
        println!("STATE: {:?}", state);
        assert!(state.offers.is_empty());
    }

    let percent_to_collection_owner = offer_price * royalty as u128 / 10_000;
    sys.claim_value_from_mailbox(USERS[1]);
    let balance = sys.balance_of(USERS[1]);
    assert_eq!(
        balance,
        offer_price - percent_to_collection_owner,
        "Wrong balance"
    );

    sys.claim_value_from_mailbox(USERS[0]);
    let balance = sys.balance_of(USERS[0]);
    assert_eq!(balance, percent_to_collection_owner, "Wrong balance");

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
