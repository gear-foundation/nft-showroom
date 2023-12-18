use crate::utils::{add_new_collection, create_collection, init_marketplace};
use utils::prelude::*;
mod utils;
use gtest::Program;
use nft_marketplace_io::*;

use auto_changed_nft_io::{
    Action, AutoNftAction, AutoNftEvent, AutoNftInit, AutoNftState, Config,
    StateQuery as StateQueryNft, StateReply as StateReplyNft,
};
const USERS: &[u64] = &[5, 6, 7, 8];

#[test]
fn successful_auto_changed() {
    let sys = utils::initialize_system();
    init_marketplace(&sys);
    let marketplace = sys.get_program(1);
    let nft_collection_code_id =
        sys.submit_code("target/wasm32-unknown-unknown/debug/auto_changed_nft.opt.wasm");

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

    let links: Vec<String> = (0..4).map(|i| format!("Img-{}", i)).collect();
    let img_links: Vec<(Vec<String>, u32)> = (0..10).map(|i| (links.clone(), 1 as u32)).collect();

    // let time_for_change = 5;
    let time_to_action = vec![
        (3, Action::ChangeImg),
        (6, Action::ChangeImg),
        (9, Action::ChangeImg),
    ];
    // Successful creation of a new collection
    let init_nft_payload = AutoNftInit {
        owner: USERS[0].into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            collection_tags: vec!["tag1".to_string()],
            user_mint_limit: 3.into(),
            // time_for_change,
            time_to_action,
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
    let result = &res.decoded_log::<Result<NftMarketplaceEvent, NftMarketplaceError>>()[0];
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

    // Successful mint NFT in the new collection
    let res = nft_collection.send(USERS[1], AutoNftAction::Mint);
    assert!(!res.main_failed());
    // let state_reply = nft_collection
    //     .read_state(StateQueryNft::All)
    //     .expect("Unexpected invalid state.");
    // if let StateReplyNft::All(state) = state_reply {
    //     println!("Collection NFT info: {:?}", state);
    //     assert_eq!(state.admins[0], USERS[0].into(), "Wrong Admin");
    //     let (owner, token_id) = state.owners.get(0).expect("Can't be None");
    //     assert_eq!(*owner, USERS[1].into(), "Wrong owner");
    //     assert_eq!(*token_id, vec![0], "Wrong token id");
    // }
    let state = get_state(&nft_collection).unwrap();
    assert_eq!(state.tokens.get(0).unwrap().1.media_url.0, 0);
    sys.spend_blocks(1);
    let state = get_state(&nft_collection).unwrap();
    assert_eq!(state.tokens.get(0).unwrap().1.media_url.0, 1);
    sys.spend_blocks(1);
    let state = get_state(&nft_collection).unwrap();
    assert_eq!(state.tokens.get(0).unwrap().1.media_url.0, 2);
    sys.spend_blocks(1);
    let state = get_state(&nft_collection).unwrap();
    assert_eq!(state.tokens.get(0).unwrap().1.media_url.0, 3);
    // sys.spend_blocks(2);
    // let state = get_state(&nft_collection).unwrap();
    // assert_eq!(state.tokens.get(0).unwrap().1.media_url.0, 3);
    // sys.spend_blocks(interval_block);
    // let state = get_state(&nft_collection).unwrap();
    // assert_eq!(state.tokens.get(0).unwrap().1.media_url.0, 0);
}

fn get_state(nft_collection: &Program) -> Option<AutoNftState> {
    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        return Some(state);
    }
    None
}
