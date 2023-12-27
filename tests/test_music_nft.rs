use crate::utils::*;
use utils::prelude::*;
mod utils;
use gtest::Program;
use music_nft_io::{
    Action, AdditionalLinks, Config, ImageData, Links, ListenCapability, MusicNftAction,
    MusicNftError, MusicNftEvent, MusicNftInit, NftState, StateQuery as StateQueryNft,
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
        sys.submit_code("target/wasm32-unknown-unknown/debug/music_nft.opt.wasm");

    let state_reply = marketplace
        .read_state(StateQuery::CollectionsInfo)
        .expect("Unexpected invalid state.");
    if let StateReply::CollectionsInfo(state) = state_reply {
        assert!(state.is_empty(), "Collection info should be empty");
        println!("Collection info: {:?}", state);
    }
    // Successful addition of a new collection
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
        println!("Collection info: {:?}", state);
    }
    // Successful creation of a new collection
    let img_data = ImageData {
        limit_copies: Some(1),
        description: None,
        auto_changing_rules: None,
    };
    let nft_data: Vec<(Links, ImageData)> = (0..10)
        .map(|i| {
            (
                Links {
                    img_link: None,
                    music_link: format!("Img-{}", i),
                },
                img_data.clone(),
            )
        })
        .collect();

    let additional_links = Some(AdditionalLinks {
        external_url: Some("External link".to_string()),
        telegram: None,
        xcom: None,
        medium: None,
        discord: None,
    });

    // Successful creation of a new collection
    let init_nft_payload = MusicNftInit {
        collection_owner: USERS[0].into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_banner: "Collection banner".to_string(),
            collection_logo: "Collection logo".to_string(),
            collection_tags: vec!["tag1".to_string()],
            additional_links,
            royalty: 0,
            user_mint_limit: 3.into(),
            listening_capabilities: ListenCapability::Demo,
            payment_for_mint: 0,
            transferable: Some(0),
            sellable: Some(0),
        },
        nft_data,
    };

    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
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
        assert_eq!(state.collection_owner, USERS[0].into(), "Wrong Admin");
        println!("Collection NFT info: {:?}", state);
    }

    // Successful change config in the new collection
    let config = Config {
        name: "My Collection".to_string(),
        description: "My Collection".to_string(),
        collection_banner: "Collection banner".to_string(),
        collection_logo: "Collection logo".to_string(),
        collection_tags: vec!["tag1".to_string()],
        additional_links: None,
        royalty: 0,
        user_mint_limit: 3.into(),
        listening_capabilities: ListenCapability::Demo,
        payment_for_mint: 0,
        transferable: Some(0),
        sellable: Some(0),
    };
    let res = nft_collection.send(USERS[0], MusicNftAction::ChangeConfig { config });
    assert!(!res.main_failed());
    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        assert_eq!(state.config.name, "My Collection".to_string());
        assert_eq!(state.config.description, "My Collection".to_string());
    }

    // Successful mint NFT in the new collection
    let res = nft_collection.send(USERS[1], MusicNftAction::Mint);
    assert!(!res.main_failed());

    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        println!("Collection NFT info: {:?}", state);
        assert_eq!(state.collection_owner, USERS[0].into(), "Wrong Admin");
        let (owner, token_id) = state.owners.get(0).expect("Can't be None");
        assert_eq!(*owner, USERS[1].into(), "Wrong owner");
        assert_eq!(*token_id, vec![0], "Wrong token id");
    }

    // Successful transfer NFT in the collection
    let res = nft_collection.send(
        USERS[1],
        MusicNftAction::Transfer {
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
        MusicNftAction::Approve {
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
        MusicNftAction::TransferFrom {
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
    let res = nft_collection.send(USERS[3], MusicNftAction::Mint);
    assert!(!res.main_failed());
    let res = nft_collection.send(USERS[3], MusicNftAction::Mint);
    assert!(!res.main_failed());
    let res = nft_collection.send(USERS[3], MusicNftAction::Mint);
    assert!(!res.main_failed());
    let res = nft_collection.send(USERS[3], MusicNftAction::Mint);
    assert!(!res.main_failed());
    // let res = res.decoded_log::<Result<MusicNftEvent, MusicNftError>>()[0];
    //println!("RES {:?}", res);
    let message: Result<MusicNftEvent, MusicNftError> =
        Err(MusicNftError("You've exhausted your limit.".to_owned()));
    assert!(res.contains(&(USERS[3], message.encode())));

    // Successful Expand NFT in the collection
    let img_data = ImageData {
        limit_copies: Some(1),
        description: None,
        auto_changing_rules: None,
    };
    let res = nft_collection.send(
        USERS[0],
        MusicNftAction::Expand {
            additional_links: vec![
                (
                    Links {
                        img_link: None,
                        music_link: "add_link_1".to_string(),
                    },
                    img_data.clone(),
                ),
                (
                    Links {
                        img_link: None,
                        music_link: "add_link_2".to_string(),
                    },
                    img_data.clone(),
                ),
            ],
        },
    );
    assert!(!res.main_failed());
    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        assert_eq!(state.nft_data.len(), 8, "Wrong length of nft_data");
        println!("STATE: {:?}", state);
    }
}

#[test]
fn failures() {
    let sys = utils::initialize_system();
    init_marketplace(&sys);
    let marketplace = sys.get_program(1);
    let nft_collection_code_id =
        sys.submit_code("target/wasm32-unknown-unknown/debug/music_nft.opt.wasm");

    let name_simple_nft = "Simple NFT".to_string();
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
        name_simple_nft.clone(),
    );
    assert!(!res.main_failed());

    // The mint limit must be greater than zero
    let img_data = ImageData {
        limit_copies: Some(1),
        description: None,
        auto_changing_rules: None,
    };
    let nft_data: Vec<(Links, ImageData)> = (0..10)
        .map(|i| {
            (
                Links {
                    img_link: None,
                    music_link: format!("Img-{}", i),
                },
                img_data.clone(),
            )
        })
        .collect();

    let additional_links = Some(AdditionalLinks {
        external_url: Some("External link".to_string()),
        telegram: None,
        xcom: None,
        medium: None,
        discord: None,
    });

    // Successful creation of a new collection
    let mut init_nft_payload = MusicNftInit {
        collection_owner: USERS[0].into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_banner: "Collection banner".to_string(),
            collection_logo: "Collection logo".to_string(),
            collection_tags: vec!["tag1".to_string()],
            additional_links,
            royalty: 0,
            user_mint_limit: 0.into(),
            listening_capabilities: ListenCapability::Demo,
            payment_for_mint: 0,
            transferable: Some(0),
            sellable: Some(0),
        },
        nft_data,
    };

    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(res.main_failed());

    // There must be at least one link to create a collection
    init_nft_payload.config.user_mint_limit = 4.into();
    init_nft_payload.nft_data = vec![];
    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(res.main_failed());

    // Limit of copies value is equal to 0
    let img_data = ImageData {
        limit_copies: Some(0),
        description: None,
        auto_changing_rules: None,
    };
    init_nft_payload.nft_data = vec![(
        Links {
            img_link: None,
            music_link: "add_link_1".to_string(),
        },
        img_data.clone(),
    )];

    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(res.main_failed());

    let img_data = ImageData {
        limit_copies: Some(1),
        description: None,
        auto_changing_rules: None,
    };
    let nft_data: Vec<(Links, ImageData)> = (0..5)
        .map(|i| {
            (
                Links {
                    img_link: None,
                    music_link: format!("Img-{}", i),
                },
                img_data.clone(),
            )
        })
        .collect();

    init_nft_payload.nft_data = nft_data;
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
        println!("Collections: {:?}", state);
        state[0].0
    } else {
        assert!(false, "Unexpected StateReply variant");
        0.into()
    };

    let address_nft: [u8; 32] = address_nft.into();
    let nft_collection = sys.get_program(address_nft);

    for _ in 0..4 {
        let res = nft_collection.send(USERS[1], MusicNftAction::Mint);
        assert!(!res.main_failed());
    }
    let res = nft_collection.send(USERS[1], MusicNftAction::Mint);
    assert!(check_payload(
        0,
        &res,
        "You've exhausted your limit.".to_string()
    ));

    assert!(!res.main_failed());

    let res = nft_collection.send(USERS[2], MusicNftAction::Mint);
    assert!(!res.main_failed());
    let res = nft_collection.send(USERS[2], MusicNftAction::Mint);
    assert!(check_payload(0, &res, "All tokens are minted.".to_string()));
    assert!(!res.main_failed());

    let config = Config {
        name: "User Collection".to_string(),
        description: "User Collection".to_string(),
        collection_banner: "Collection banner".to_string(),
        collection_logo: "Collection logo".to_string(),
        collection_tags: vec!["tag1".to_string()],
        additional_links: None,
        royalty: 0,
        user_mint_limit: 3.into(),
        listening_capabilities: ListenCapability::Demo,
        payment_for_mint: 0,
        transferable: Some(0),
        sellable: Some(0),
    };
    let res = nft_collection.send(USERS[0], MusicNftAction::ChangeConfig { config });
    assert!(check_payload(
        0,
        &res,
        "The collection configuration can no more be changed".to_string()
    ));
    assert!(!res.main_failed());

    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        println!("STATE: {:?}", state);
    }

    let img_data = ImageData {
        limit_copies: Some(4),
        description: None,
        auto_changing_rules: None,
    };
    let res = nft_collection.send(
        USERS[0],
        MusicNftAction::Expand {
            additional_links: vec![(
                Links {
                    img_link: None,
                    music_link: "New link".to_string(),
                },
                img_data.clone(),
            )],
        },
    );
    assert!(!res.main_failed());
    let res = nft_collection.send(USERS[2], MusicNftAction::Mint);
    assert!(!res.main_failed());
    let res = nft_collection.send(
        USERS[2],
        MusicNftAction::Approve {
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
        MusicNftAction::Transfer {
            to: USERS[1].into(),
            token_id: 5,
        },
    );
    assert!(!res.main_failed());
    let res = nft_collection.send(
        USERS[3],
        MusicNftAction::TransferFrom {
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

    assert!(check_payload(
        0,
        &res,
        "Target token_approvals is empty.".to_string()
    ));
}

#[test]
fn check_auto_changing_rules() {
    let sys = utils::initialize_system();
    init_marketplace(&sys);
    let marketplace = sys.get_program(1);
    let nft_collection_code_id =
        sys.submit_code("target/wasm32-unknown-unknown/debug/music_nft.opt.wasm");

    let state_reply = marketplace
        .read_state(StateQuery::CollectionsInfo)
        .expect("Unexpected invalid state.");
    if let StateReply::CollectionsInfo(state) = state_reply {
        assert!(state.is_empty(), "Collection info should be empty");
        println!("Collection info: {:?}", state);
    }
    // Successful addition of a new collection
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
        println!("Collection info: {:?}", state);
    }
    let img_data = ImageData {
        limit_copies: Some(1),
        description: None,
        auto_changing_rules: Some(vec![
            (9, Action::ChangeImg("Auto change image".to_string())),
            (18, Action::AddMeta("Auto change metadata".to_string())),
        ]),
    };
    let nft_data: Vec<(Links, ImageData)> = (0..10)
        .map(|i| {
            (
                Links {
                    img_link: None,
                    music_link: format!("Img-{}", i),
                },
                img_data.clone(),
            )
        })
        .collect();

    let additional_links = Some(AdditionalLinks {
        external_url: Some("External link".to_string()),
        telegram: None,
        xcom: None,
        medium: None,
        discord: None,
    });

    // Successful creation of a new collection
    let init_nft_payload = MusicNftInit {
        collection_owner: USERS[0].into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_banner: "Collection banner".to_string(),
            collection_logo: "Collection logo".to_string(),
            collection_tags: vec!["tag1".to_string()],
            additional_links,
            royalty: 0,
            user_mint_limit: 3.into(),
            listening_capabilities: ListenCapability::Demo,
            payment_for_mint: 0,
            transferable: Some(0),
            sellable: Some(0),
        },
        nft_data,
    };
    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
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
        assert_eq!(state.collection_owner, USERS[0].into(), "Wrong Admin");
        println!("Collection NFT info: {:?}", state);
    }

    // Successful mint NFT in the new collection
    let res = nft_collection.send(USERS[1], MusicNftAction::Mint);
    assert!(!res.main_failed());

    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        println!("Collection NFT info: {:?}", state);
        assert_eq!(state.collection_owner, USERS[0].into(), "Wrong Admin");
        let (owner, token_id) = state.owners.get(0).expect("Can't be None");
        assert_eq!(*owner, USERS[1].into(), "Wrong owner");
        assert_eq!(*token_id, vec![0], "Wrong token id");
    }

    let state = get_state(&nft_collection).unwrap();
    assert_ne!(state.tokens[0].1.img_link, "Auto change image".to_string());
    assert_ne!(
        state.tokens[0].1.metadata,
        vec!["Auto change metadata".to_string()]
    );
    sys.spend_blocks(3);
    let state = get_state(&nft_collection).unwrap();
    assert_eq!(state.tokens[0].1.img_link, "Auto change image".to_string());
    assert_ne!(
        state.tokens[0].1.metadata,
        vec!["Auto change metadata".to_string()]
    );
    sys.spend_blocks(6);
    let state = get_state(&nft_collection).unwrap();
    assert_eq!(state.tokens[0].1.img_link, "Auto change image".to_string());
    assert_eq!(
        state.tokens[0].1.metadata,
        vec!["Auto change metadata".to_string()]
    );
}

#[test]
fn check_transferable() {
    let sys = utils::initialize_system();
    init_marketplace(&sys);
    let marketplace = sys.get_program(1);
    let nft_collection_code_id =
        sys.submit_code("target/wasm32-unknown-unknown/debug/music_nft.opt.wasm");

    // Successful addition of a new collection
    let name_simple_nft = "Simple NFT".to_string();
    let res = add_new_collection(
        &marketplace,
        ADMINS[0],
        nft_collection_code_id.into_bytes().into(),
        name_simple_nft.clone(),
    );
    assert!(!res.main_failed());

    let img_data = ImageData {
        limit_copies: Some(1),
        description: None,
        auto_changing_rules: None,
    };
    let nft_data: Vec<(Links, ImageData)> = (0..10)
        .map(|i| {
            (
                Links {
                    img_link: None,
                    music_link: format!("Img-{}", i),
                },
                img_data.clone(),
            )
        })
        .collect();

    let additional_links = Some(AdditionalLinks {
        external_url: Some("External link".to_string()),
        telegram: None,
        xcom: None,
        medium: None,
        discord: None,
    });

    // Successful creation of a new collection
    let mut init_nft_payload = MusicNftInit {
        collection_owner: USERS[0].into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_banner: "Collection banner".to_string(),
            collection_logo: "Collection logo".to_string(),
            collection_tags: vec!["tag1".to_string()],
            additional_links,
            royalty: 0,
            user_mint_limit: 3.into(),
            listening_capabilities: ListenCapability::Demo,
            payment_for_mint: 0,
            transferable: Some(0),
            sellable: Some(0),
        },
        nft_data,
    };

    let transferable_time = 9_000;
    init_nft_payload.config.transferable = Some(transferable_time);
    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
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
        assert_eq!(state.collection_owner, USERS[0].into(), "Wrong Admin");
        println!("Collection NFT info: {:?}", state);
    }

    // Successful mint NFT in the new collection
    let res = nft_collection.send(USERS[1], MusicNftAction::Mint);
    assert!(!res.main_failed());

    // Transfer NFT in the collection
    let res = nft_collection.send(
        USERS[1],
        MusicNftAction::Transfer {
            to: USERS[2].into(),
            token_id: 0,
        },
    );
    assert!(!res.main_failed());
    assert!(check_payload(
        0,
        &res,
        "NonFungibleToken: transfer will be available after the deadline".to_string()
    ));

    sys.spend_blocks(3);

    let res = nft_collection.send(
        USERS[1],
        MusicNftAction::Transfer {
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
}

#[test]
fn check_payment_for_mint() {
    let sys = utils::initialize_system();
    init_marketplace(&sys);
    let marketplace = sys.get_program(1);
    let nft_collection_code_id =
        sys.submit_code("target/wasm32-unknown-unknown/debug/music_nft.opt.wasm");

    let state_reply = marketplace
        .read_state(StateQuery::CollectionsInfo)
        .expect("Unexpected invalid state.");
    if let StateReply::CollectionsInfo(state) = state_reply {
        assert!(state.is_empty(), "Collection info should be empty");
        println!("Collection info: {:?}", state);
    }
    // Successful addition of a new collection
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
        println!("Collection info: {:?}", state);
    }

    // The payment for mint must be greater than existential deposit (10000000000000)
    let img_data = ImageData {
        limit_copies: Some(1),
        description: None,
        auto_changing_rules: None,
    };
    let nft_data: Vec<(Links, ImageData)> = (0..10)
        .map(|i| {
            (
                Links {
                    img_link: None,
                    music_link: format!("Img-{}", i),
                },
                img_data.clone(),
            )
        })
        .collect();

    let additional_links = Some(AdditionalLinks {
        external_url: Some("External link".to_string()),
        telegram: None,
        xcom: None,
        medium: None,
        discord: None,
    });

    // Successful creation of a new collection
    let mut init_nft_payload = MusicNftInit {
        collection_owner: USERS[0].into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_banner: "Collection banner".to_string(),
            collection_logo: "Collection logo".to_string(),
            collection_tags: vec!["tag1".to_string()],
            additional_links,
            royalty: 0,
            user_mint_limit: 3.into(),
            listening_capabilities: ListenCapability::Demo,
            payment_for_mint: 0,
            transferable: Some(0),
            sellable: Some(0),
        },
        nft_data,
    };

    let payment_for_mint = 9_000_000_000_000;
    init_nft_payload.config.payment_for_mint = payment_for_mint;
    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
    assert!(res.main_failed());

    // Successful creation of a new collection
    let payment_for_mint = 11_000_000_000_000;
    init_nft_payload.config.payment_for_mint = payment_for_mint;
    let res = create_collection(
        &marketplace,
        USERS[0],
        name_simple_nft.clone(),
        init_nft_payload.encode(),
    );
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
        assert_eq!(state.collection_owner, USERS[0].into(), "Wrong Admin");
        println!("Collection NFT info: {:?}", state);
    }

    // Successful mint NFT in the new collection
    sys.mint_to(USERS[1], 2 * payment_for_mint);
    let res = nft_collection.send_with_value(USERS[1], MusicNftAction::Mint, payment_for_mint);
    assert!(!res.main_failed());

    sys.claim_value_from_mailbox(USERS[0]);
    let balance = sys.balance_of(USERS[0]);
    assert_eq!(balance, payment_for_mint, "Wrong balance");
    let res = nft_collection.send_with_value(USERS[1], MusicNftAction::Mint, payment_for_mint - 1);
    assert!(!res.main_failed());

    assert!(check_payload(
        0,
        &res,
        "Incorrectly entered mint fee.".to_string()
    ));
}

fn get_state(nft_collection: &Program) -> Option<NftState> {
    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        return Some(state);
    }
    None
}
