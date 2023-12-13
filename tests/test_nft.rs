use crate::utils::{add_new_collection, create_collection, init_marketplace};
use utils::prelude::*;
mod utils;
use nft_io::{
    Config, NftAction, NftError, NftEvent, NftInit, StateQuery as StateQueryNft,
    StateReply as StateReplyNft,
};
use nft_marketplace_io::*;

const USERS: &[u64] = &[5, 6, 7, 8];

#[test]
fn successful_basics() {
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
    // Successful addition of a new collection
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
        println!("Collection info: {:?}", state);
    }

    let img_links: Vec<(String, u32)> = (0..10).map(|i| (format!("Img-{}", i), 1 as u32)).collect();

    // Successful creation of a new collection
    let init_nft_payload = NftInit {
        owner: USERS[0].into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            collection_tags: vec!["tag1".to_string()],
            user_mint_limit: 3.into(),
            transferable: true,
            approvable: true,
            burnable: true,
            sellable: true,
            attendable: true,
        },
        img_links,
    };
    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(!res.main_failed());
    let result = &res.decoded_log::<Result<NftMarketplaceEvent, NftMarketplaceError>>();
    println!("RES: {:?}", result);
    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    let address_nft = if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        println!("Collections: {:?}", state);
        state[0].0
    } else {
        assert!(false, "Unexpected StateReply variant");
        0.into()
    };

    let address_nft: [u8; 32] = address_nft.into();
    let nft_collection = sys.get_program(address_nft);
    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        assert_eq!(state.admins[0], USERS[0].into(), "Wrong Admin");
        println!("Collection NFT info: {:?}", state);
    }

    // Successful change config in the new collection
    let config = Config {
        name: "My Collection".to_string(),
        description: "My Collection".to_string(),
        collection_img: "Collection image".to_string(),
        collection_tags: vec!["tag1".to_string()],
        user_mint_limit: 3.into(),
        transferable: true,
        approvable: true,
        burnable: true,
        sellable: true,
        attendable: true,
    };
    let res = nft_collection.send(USERS[0], NftAction::ChangeConfig { config });
    assert!(!res.main_failed());
    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        assert_eq!(state.config.name, "My Collection".to_string());
        assert_eq!(state.config.description, "My Collection".to_string());
    }

    // Successful mint NFT in the new collection
    let res = nft_collection.send(USERS[1], NftAction::Mint);
    assert!(!res.main_failed());

    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        println!("Collection NFT info: {:?}", state);
        assert_eq!(state.admins[0], USERS[0].into(), "Wrong Admin");
        let (owner, token_id) = state.owners.get(0).expect("Can't be None");
        assert_eq!(*owner, USERS[1].into(), "Wrong owner");
        assert_eq!(*token_id, vec![0], "Wrong token id");
    }

    // Successful transfer NFT in the collection
    let res = nft_collection.send(
        USERS[1],
        NftAction::Transfer {
            to: USERS[2].into(),
            token_id: 0,
        },
    );
    assert!(!res.main_failed());

    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        println!("!!!!!!!!!! STATE: {:?}", state);
        let (owner, token_id) = state.owners.get(0).expect("Can't be None");
        assert_eq!(*owner, USERS[2].into(), "Wrong owner");
        assert_eq!(*token_id, vec![0], "Wrong token id");
    }

    // Successful approve NFT in the collection (USERS[2] -Approve-> USERS[1])
    let res = nft_collection.send(
        USERS[2],
        NftAction::Approve {
            to: USERS[1].into(),
            token_id: 0,
        },
    );
    assert!(!res.main_failed());

    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        let (token_id, approval) = state.token_approvals.get(0).expect("Can't be None");
        assert_eq!(*token_id, 0, "Wrong owner");
        assert_eq!(*approval, USERS[1].into(), "Wrong token id");
    }
    // Check approve (USERS[1] -Transfer-> USERS[3])
    let res = nft_collection.send(
        USERS[1],
        NftAction::TransferFrom {
            from: USERS[2].into(),
            to: USERS[3].into(),
            token_id: 0,
        },
    );
    assert!(!res.main_failed());

    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        println!("STATE OWNERS: {:?}", state.owners);
        let (owner, token_id) = state.owners.get(0).expect("Can't be None");
        assert_eq!(*owner, USERS[3].into(), "Wrong owner");
        assert_eq!(*token_id, vec![0], "Wrong token id");
    }

    // Check limit of mint = 3
    let res = nft_collection.send(USERS[3], NftAction::Mint);
    assert!(!res.main_failed());
    let res = nft_collection.send(USERS[3], NftAction::Mint);
    assert!(!res.main_failed());
    let res = nft_collection.send(USERS[3], NftAction::Mint);
    assert!(!res.main_failed());
    let res = nft_collection.send(USERS[3], NftAction::Mint);
    assert!(!res.main_failed());
    // let res = res.decoded_log::<Result<NftEvent, NftError>>()[0];
    //println!("RES {:?}", res);
    let message: Result<NftEvent, NftError> =
        Err(NftError("You've exhausted your limit.".to_owned()));
    assert!(res.contains(&(USERS[3], message.encode())));

    // Successful burn NFT in the collection
    let res = nft_collection.send(USERS[3], NftAction::Mint);
    assert!(!res.main_failed());
    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        println!("STATE OWNERS: {:?}", state.owners);
    }
    let res = nft_collection.send(USERS[3], NftAction::Burn { token_id: 0 });
    assert!(!res.main_failed());

    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        println!("STATE OWNERS: {:?}", state.owners);
        let (owner, token_id) = state.owners.get(0).expect("Can't be None");
        assert_eq!(*owner, USERS[3].into(), "Wrong owner");
        assert_eq!(token_id.len(), 3, "Wrong token id");
    }

    // Successful Expand NFT in the collection
    let res = nft_collection.send(
        USERS[0],
        NftAction::Expand {
            additional_links: vec![
                ("add_link_1".to_string(), 1 as u32),
                ("add_link_2".to_string(), 1 as u32),
            ],
        },
    );
    assert!(!res.main_failed());
    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        assert_eq!(state.img_links.len(), 8, "Wrong length of img_links");
        println!("STATE: {:?}", state);
    }

    // let res = nft_collection.send(USERS[1], NftAction::Mint);
    // let payload = res.log()[0].payload();
    // let expected_payload = NftEvent::Error("You've exhausted your limit.".to_owned()).encode();
    // assert_eq!(expected_payload, payload);
    // assert!(!res.main_failed());
    // let state_reply = nft_collection.read_state(StateQueryNft::All).expect("Unexpected invalid state.");
    // if let StateReplyNft::All(state) = state_reply {
    //     println!("");
    //     println!("Collection NFT info: {:?}", state);
    // }
}

#[test]
fn failures() {
    let sys = utils::initialize_system();
    init_marketplace(&sys);
    let marketplace = sys.get_program(1);
    let nft_collection_code_id =
        sys.submit_code("target/wasm32-unknown-unknown/debug/nft.opt.wasm");

    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
    );
    assert!(!res.main_failed());

    let img_links: Vec<(String, u32)> = (0..5).map(|i| (format!("Img-{}", i), 1 as u32)).collect();

    // The mint limit must be greater than zero
    let mut init_nft_payload = NftInit {
        owner: USERS[0].into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            collection_tags: vec!["tag1".to_string()],
            user_mint_limit: 3.into(),
            transferable: true,
            approvable: true,
            burnable: true,
            sellable: true,
            attendable: true,
        },
        img_links: img_links.clone(),
    };
    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(res.main_failed());

    // There must be at least one link to create a collection
    init_nft_payload.config.user_mint_limit = 4.into();
    init_nft_payload.img_links = vec![];
    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(res.main_failed());

    // Limit of copies value is equal to 0
    init_nft_payload.img_links = vec![("Img-0".to_owned(), 0)];
    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(res.main_failed());

    init_nft_payload.img_links = img_links;
    let res = create_collection(&marketplace, USERS[0], 1, init_nft_payload.encode());
    assert!(!res.main_failed());

    let state_reply = marketplace
        .read_state(StateQuery::AllCollections)
        .expect("Unexpected invalid state.");
    let address_nft = if let StateReply::AllCollections(state) = state_reply {
        assert!(!state.is_empty(), "Collections shouldn't be empty");
        println!("Collections: {:?}", state);
        state[0].0
    } else {
        assert!(false, "Unexpected StateReply variant");
        0.into()
    };

    let address_nft: [u8; 32] = address_nft.into();
    let nft_collection = sys.get_program(address_nft);

    for _ in 0..4 {
        let res = nft_collection.send(USERS[1], NftAction::Mint);
        assert!(!res.main_failed());
    }
    let res = nft_collection.send(USERS[1], NftAction::Mint);
    let payload = res.log()[0].payload();
    let expected_payload = NftError("You've exhausted your limit.".to_owned()).encode();
    assert_eq!(expected_payload, payload);
    assert!(!res.main_failed());

    let res = nft_collection.send(USERS[2], NftAction::Mint);
    assert!(!res.main_failed());
    let res = nft_collection.send(USERS[2], NftAction::Mint);
    let payload = res.log()[0].payload();
    let expected_payload = NftError("All tokens are minted.".to_owned()).encode();
    assert_eq!(expected_payload, payload);
    assert!(!res.main_failed());

    let config = Config {
        name: "User Collection".to_string(),
        description: "User Collection".to_string(),
        collection_img: "Collection image".to_string(),
        collection_tags: vec!["tag1".to_string()],
        user_mint_limit: 3.into(),
        transferable: true,
        approvable: true,
        burnable: true,
        sellable: true,
        attendable: true,
    };
    let res = nft_collection.send(USERS[0], NftAction::ChangeConfig { config });
    let payload = res.log()[0].payload();
    let expected_payload =
        NftError("The collection configuration can no more be changed".to_owned()).encode();
    assert_eq!(expected_payload, payload);
    assert!(!res.main_failed());

    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        println!("STATE: {:?}", state);
    }

    let res = nft_collection.send(
        USERS[0],
        NftAction::Expand {
            additional_links: vec![("New_img".to_owned(), 4)],
        },
    );
    assert!(!res.main_failed());
    let res = nft_collection.send(USERS[2], NftAction::Mint);
    assert!(!res.main_failed());
    let res = nft_collection.send(
        USERS[2],
        NftAction::Approve {
            to: USERS[3].into(),
            token_id: 5,
        },
    );
    assert!(!res.main_failed());
    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        println!("STATE: {:?}", state);
    }
    let res = nft_collection.send(
        USERS[2],
        NftAction::Transfer {
            to: USERS[1].into(),
            token_id: 5,
        },
    );
    assert!(!res.main_failed());
    let res = nft_collection.send(
        USERS[3],
        NftAction::TransferFrom {
            from: USERS[1].into(),
            to: USERS[3].into(),
            token_id: 5,
        },
    );
    assert!(!res.main_failed());
    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        println!("STATE: {:?}", state);
    }
    let payload = res.log()[0].payload();
    let expected_payload = NftError("Target approvals is empty.".to_owned()).encode();
    assert_eq!(expected_payload, payload);
}

// TODO
// #[test]
// fn admin_features() {

// }
