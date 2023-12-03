use crate::utils::{add_new_collection, create_collection, init_marketplace};
use utils::prelude::*;
mod utils;
use composable_nft_io::{
    ComposableNftAction, ComposableNftEvent, ComposableNftInit, Config,
    StateQuery as StateQueryNft, StateReply as StateReplyNft,
};
use nft_marketplace_io::*;

const USERS: &[u64] = &[5, 6, 7, 8];

#[test]
fn successful_basics() {
    let sys = utils::initialize_system();
    init_marketplace(&sys);
    let marketplace = sys.get_program(1);
    let nft_collection_code_id =
        sys.submit_code("target/wasm32-unknown-unknown/debug/composable_nft.opt.wasm");

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
        assert_eq!(
            state[0].1.collection_id, 1,
            "Collection id should be equal by 0"
        );
        println!("Collection info: {:?}", state);
    }

    // Successful creation of a new collection

    let mut img_links: Vec<Vec<String>> = Vec::with_capacity(4);

    for k in 0..3 {
        let inner_vec: Vec<String> = (0..10).map(|i| format!("img{}-{}", k, i)).collect();

        img_links.push(inner_vec);
    }

    let init_nft_payload = ComposableNftInit {
        owner: USERS[0].into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            mint_limit: 3.into(),
            tokens_limit: Some(500),
            transferable: true,
            approvable: true,
            burnable: true,
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
        println!("Collections: {:?}", state);
        state[0].1[0]
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
        assert_eq!(state.admins[1], USERS[0].into(), "Wrong Admin");
        println!("Collection NFT info: {:?}", state);
    }

    // Successful mint NFT in the new collection
    let res = nft_collection.send(
        USERS[1],
        ComposableNftAction::Mint {
            combination: vec![0, 0, 0],
        },
    );
    // let payload = res.log()[0].payload();
    // let expected_payload = ComposableNftEvent::Error("Incorrectly entered combination: wrong combination length".to_owned()).encode();
    // assert_eq!(expected_payload, payload);
    assert!(!res.main_failed());

    let state_reply = nft_collection
        .read_state(StateQueryNft::All)
        .expect("Unexpected invalid state.");
    if let StateReplyNft::All(state) = state_reply {
        assert_eq!(state.admins[1], USERS[0].into(), "Wrong Admin");
        let (owner, token_id) = state.owners.get(0).expect("Can't be None");
        assert_eq!(*owner, USERS[1].into(), "Wrong owner");
        assert_eq!(*token_id, vec![0], "Wrong token id");
        println!("TOKEN INFO: {:?}", state.tokens);
    }
}
