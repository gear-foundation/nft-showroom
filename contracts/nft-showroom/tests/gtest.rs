use sails_rs::{
    ActorId, Encode,
    calls::*,
    gtest::{System, calls::*},
};

use nft_client::{Config as NftConfig, ImageData, traits::Nft};
use nft_showroom_client::{Config, Offer, traits::*};
const USERS_ID: &[u64] = &[42, 43, 44];

pub fn get_init_nft_payload(
    collection_owner: ActorId,
    royalty: u16,
    user_mint_limit: Option<u32>,
    payment_for_mint: u128,
    permission_to_mint: Option<Vec<ActorId>>,
) -> Vec<u8> {
    let img_data = ImageData {
        limit_copies: Some(1),
    };
    let img_links_and_data: Vec<(String, ImageData)> = (0..10)
        .map(|i| (format!("Img-{}", i), img_data.clone()))
        .collect();
    let nft_config = NftConfig {
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
        variable_meta: false,
    };
    [
        "New".encode(),
        (
            collection_owner,
            nft_config,
            img_links_and_data,
            permission_to_mint,
        )
            .encode(),
    ]
    .concat()
}

#[tokio::test]
async fn test_create_collection() {
    let system = System::new();
    system.init_logger_with_default_filter("gwasm=debug,gtest=info,sails_rs=debug");
    system.mint_to(USERS_ID[0], 100_000_000_000_000);
    let remoting = GTestRemoting::new(system, USERS_ID[0].into());

    // Submit program code into the system
    let program_code_id = remoting.system().submit_code(nft_showroom::WASM_BINARY);

    let program_factory = nft_showroom_client::NftShowroomFactory::new(remoting.clone());

    let program_id = program_factory
        .new(Config {
            gas_for_creation: 5_000_000_000,
            gas_for_mint: 7_000_000_000,
            gas_for_transfer_token: 4_000_000_000,
            gas_for_close_auction: 15_000_000_000,
            gas_for_delete_collection: 3_000_000_000,
            gas_for_get_info: 5_000_000_000,
            time_between_create_collections: 3_600_000, // 1 hour in milliseconds
            royalty_to_marketplace_for_trade: 200,
            royalty_to_marketplace_for_mint: 200,
            ms_in_block: 3_000,
            fee_per_uploaded_file: 257_142_857_100,
            max_creator_royalty: 1_000,
            max_number_of_images: 10_000,
        })
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let mut service_client = nft_showroom_client::NftShowroom::new(remoting.clone());

    let nft_collection_code_id = remoting
        .system()
        .submit_code_file("../nft/target/wasm32-gear/release/nft.opt.wasm");

    service_client
        .add_new_collection(
            nft_collection_code_id,
            "idl_link".to_string(),
            "type_name".to_string(),
            "type_description".to_string(),
            true,
        )
        .send_recv(program_id)
        .await
        .unwrap();

    let payload = get_init_nft_payload(USERS_ID[0].into(), 0, Some(3), 0, None);
    service_client
        .create_collection("type_name".to_string(), payload)
        .with_value(3_828_571_429_000)
        .send_recv(program_id)
        .await
        .unwrap();

    let collections = service_client
        .get_all_collections()
        .recv(program_id)
        .await
        .unwrap();

    assert_eq!(collections.len(), 1);
    // let nft_address = res.get(0).expect("Should exist").0;
}

#[tokio::test]
async fn test_sale() {
    let system = System::new();
    system.init_logger_with_default_filter("gwasm=debug,gtest=info,sails_rs=debug");
    system.mint_to(USERS_ID[0], 1_000_000_000_000_000);
    system.mint_to(USERS_ID[1], 1_000_000_000_000_000);
    let remoting = GTestRemoting::new(system, USERS_ID[0].into());

    // Submit program code into the system
    let program_code_id = remoting.system().submit_code(nft_showroom::WASM_BINARY);

    let program_factory = nft_showroom_client::NftShowroomFactory::new(remoting.clone());

    let program_id = program_factory
        .new(Config {
            gas_for_creation: 5_000_000_000,
            gas_for_mint: 7_000_000_000,
            gas_for_transfer_token: 4_000_000_000,
            gas_for_close_auction: 15_000_000_000,
            gas_for_delete_collection: 3_000_000_000,
            gas_for_get_info: 5_000_000_000,
            time_between_create_collections: 3_600_000, // 1 hour in milliseconds
            royalty_to_marketplace_for_trade: 200,
            royalty_to_marketplace_for_mint: 200,
            ms_in_block: 3_000,
            fee_per_uploaded_file: 257_142_857_100,
            max_creator_royalty: 1_000,
            max_number_of_images: 10_000,
        })
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let mut service_client = nft_showroom_client::NftShowroom::new(remoting.clone());

    let nft_collection_code_id = remoting
        .system()
        .submit_code_file("../nft/target/wasm32-gear/release/nft.opt.wasm");

    service_client
        .allow_message(true)
        .send_recv(program_id)
        .await
        .unwrap();
    service_client
        .add_new_collection(
            nft_collection_code_id,
            "idl_link".to_string(),
            "type_name".to_string(),
            "type_description".to_string(),
            true,
        )
        .send_recv(program_id)
        .await
        .unwrap();

    let payload = get_init_nft_payload(USERS_ID[0].into(), 0, Some(3), 0, None);
    service_client
        .create_collection("type_name".to_string(), payload)
        .with_value(3_828_571_429_000)
        .send_recv(program_id)
        .await
        .unwrap();

    let collections = service_client
        .get_all_collections()
        .recv(program_id)
        .await
        .unwrap();

    assert_eq!(collections.len(), 1);
    let nft_address = collections.get(0).expect("Should exist").0;

    service_client
        .mint(nft_address, None)
        .send_recv(program_id)
        .await
        .unwrap();

    let mut nft_service_client = nft_client::Nft::new(remoting.clone());

    let token_id = 0;
    let price = 150_000_000_000_000;

    nft_service_client
        .approve(program_id, token_id)
        .send_recv(nft_address)
        .await
        .unwrap();

    service_client
        .sell(nft_address, token_id, price)
        .send_recv(program_id)
        .await
        .unwrap();
    let state = service_client.all().recv(program_id).await.unwrap();
    assert_eq!(state.sales.len(), 1);

    let old_balance = remoting.system().balance_of(USERS_ID[0]);

    service_client
        .buy(nft_address, token_id)
        .with_args(|args| args.with_actor_id(USERS_ID[1].into()))
        .with_value(price)
        .send_recv(program_id)
        .await
        .unwrap();

    let state = service_client.all().recv(program_id).await.unwrap();
    assert_eq!(state.sales.len(), 0);

    let new_balance = remoting.system().balance_of(USERS_ID[0]);
    assert!(new_balance - old_balance > (price as f32 * 0.97) as u128);

    let token_info = nft_service_client
        .get_token_info(0)
        .recv(nft_address)
        .await
        .unwrap();
    assert_eq!(token_info.token_owner, USERS_ID[1].into());
}

#[tokio::test]
async fn test_auction() {
    let system = System::new();
    system.init_logger_with_default_filter("gwasm=debug,gtest=info,sails_rs=debug");
    system.mint_to(USERS_ID[0], 1_000_000_000_000_000);
    system.mint_to(USERS_ID[1], 1_000_000_000_000_000);
    system.mint_to(USERS_ID[2], 1_000_000_000_000_000);
    let remoting = GTestRemoting::new(system, USERS_ID[0].into());

    // Submit program code into the system
    let program_code_id = remoting.system().submit_code(nft_showroom::WASM_BINARY);

    let program_factory = nft_showroom_client::NftShowroomFactory::new(remoting.clone());

    let program_id = program_factory
        .new(Config {
            gas_for_creation: 5_000_000_000,
            gas_for_mint: 7_000_000_000,
            gas_for_transfer_token: 4_000_000_000,
            gas_for_close_auction: 15_000_000_000,
            gas_for_delete_collection: 3_000_000_000,
            gas_for_get_info: 5_000_000_000,
            time_between_create_collections: 3_600_000, // 1 hour in milliseconds
            royalty_to_marketplace_for_trade: 200,
            royalty_to_marketplace_for_mint: 200,
            ms_in_block: 3_000,
            fee_per_uploaded_file: 257_142_857_100,
            max_creator_royalty: 1_000,
            max_number_of_images: 10_000,
        })
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let mut service_client = nft_showroom_client::NftShowroom::new(remoting.clone());

    let nft_collection_code_id = remoting
        .system()
        .submit_code_file("../nft/target/wasm32-gear/release/nft.opt.wasm");

    service_client
        .allow_message(true)
        .send_recv(program_id)
        .await
        .unwrap();
    service_client
        .add_new_collection(
            nft_collection_code_id,
            "idl_link".to_string(),
            "type_name".to_string(),
            "type_description".to_string(),
            true,
        )
        .send_recv(program_id)
        .await
        .unwrap();

    let payload = get_init_nft_payload(USERS_ID[0].into(), 0, Some(3), 0, None);
    service_client
        .create_collection("type_name".to_string(), payload)
        .with_value(3_828_571_429_000)
        .send_recv(program_id)
        .await
        .unwrap();

    let collections = service_client
        .get_all_collections()
        .recv(program_id)
        .await
        .unwrap();

    assert_eq!(collections.len(), 1);
    let nft_address = collections.get(0).expect("Should exist").0;

    service_client
        .mint(nft_address, None)
        .send_recv(program_id)
        .await
        .unwrap();

    let mut nft_service_client = nft_client::Nft::new(remoting.clone());

    let token_id = 0;

    nft_service_client
        .approve(program_id, token_id)
        .send_recv(nft_address)
        .await
        .unwrap();

    let min_price = 10_000_000_000_000;
    let duration = 10;

    service_client
        .create_auction(nft_address, token_id, min_price, duration)
        .send_recv(program_id)
        .await
        .unwrap();

    let state = service_client.all().recv(program_id).await.unwrap();
    assert_eq!(state.auctions.len(), 1);

    service_client
        .add_bid(nft_address, token_id)
        .with_actor_id(USERS_ID[1].into())
        .with_value(10_000_000_000_000)
        .send_recv(program_id)
        .await
        .unwrap();

    let old_balance = remoting.system().balance_of(USERS_ID[1]);

    let state = service_client.all().recv(program_id).await.unwrap();
    assert_eq!(state.auctions[0].1.current_winner, USERS_ID[1].into());

    service_client
        .add_bid(nft_address, token_id)
        .with_actor_id(USERS_ID[2].into())
        .with_value(100_000_000_000_000)
        .send_recv(program_id)
        .await
        .unwrap();

    let new_balance = remoting.system().balance_of(USERS_ID[1]);
    assert_eq!(new_balance - old_balance, 10_000_000_000_000);

    let state = service_client.all().recv(program_id).await.unwrap();
    assert_eq!(state.auctions[0].1.current_winner, USERS_ID[2].into());

    let old_balance = remoting.system().balance_of(USERS_ID[0]);
    for _ in 0..duration {
        remoting.system().run_next_block();
    }

    let new_balance = remoting.system().balance_of(USERS_ID[0]);
    assert!(new_balance - old_balance > 98_000_000_000_000);

    let token_info = nft_service_client
        .get_token_info(0)
        .recv(nft_address)
        .await
        .unwrap();
    assert_eq!(token_info.token_owner, USERS_ID[2].into());
}

#[tokio::test]
async fn test_offer() {
    let system = System::new();
    system.init_logger_with_default_filter("gwasm=debug,gtest=info,sails_rs=debug");
    system.mint_to(USERS_ID[0], 1_000_000_000_000_000);
    system.mint_to(USERS_ID[1], 1_000_000_000_000_000);
    let remoting = GTestRemoting::new(system, USERS_ID[0].into());

    // Submit program code into the system
    let program_code_id = remoting.system().submit_code(nft_showroom::WASM_BINARY);

    let program_factory = nft_showroom_client::NftShowroomFactory::new(remoting.clone());

    let program_id = program_factory
        .new(Config {
            gas_for_creation: 5_000_000_000,
            gas_for_mint: 7_000_000_000,
            gas_for_transfer_token: 4_000_000_000,
            gas_for_close_auction: 15_000_000_000,
            gas_for_delete_collection: 3_000_000_000,
            gas_for_get_info: 5_000_000_000,
            time_between_create_collections: 3_600_000, // 1 hour in milliseconds
            royalty_to_marketplace_for_trade: 200,
            royalty_to_marketplace_for_mint: 200,
            ms_in_block: 3_000,
            fee_per_uploaded_file: 257_142_857_100,
            max_creator_royalty: 1_000,
            max_number_of_images: 10_000,
        })
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let mut service_client = nft_showroom_client::NftShowroom::new(remoting.clone());

    let nft_collection_code_id = remoting
        .system()
        .submit_code_file("../nft/target/wasm32-gear/release/nft.opt.wasm");

    service_client
        .allow_message(true)
        .send_recv(program_id)
        .await
        .unwrap();
    service_client
        .add_new_collection(
            nft_collection_code_id,
            "idl_link".to_string(),
            "type_name".to_string(),
            "type_description".to_string(),
            true,
        )
        .send_recv(program_id)
        .await
        .unwrap();

    let payload = get_init_nft_payload(USERS_ID[0].into(), 0, Some(3), 0, None);
    service_client
        .create_collection("type_name".to_string(), payload)
        .with_value(3_828_571_429_000)
        .send_recv(program_id)
        .await
        .unwrap();

    let collections = service_client
        .get_all_collections()
        .recv(program_id)
        .await
        .unwrap();

    assert_eq!(collections.len(), 1);
    let nft_address = collections.get(0).expect("Should exist").0;

    service_client
        .mint(nft_address, None)
        .send_recv(program_id)
        .await
        .unwrap();

    let mut nft_service_client = nft_client::Nft::new(remoting.clone());

    let token_id = 0;

    nft_service_client
        .approve(program_id, token_id)
        .send_recv(nft_address)
        .await
        .unwrap();
    let offer_price = 150_000_000_000_000;
    service_client
        .create_offer(nft_address, token_id)
        .with_value(offer_price)
        .with_actor_id(USERS_ID[1].into())
        .send_recv(program_id)
        .await
        .unwrap();

    let state = service_client.all().recv(program_id).await.unwrap();
    assert_eq!(state.offers.len(), 1);
    let offer = Offer {
        collection_address: nft_address,
        token_id,
        creator: USERS_ID[1].into(),
    };

    let old_balance = remoting.system().balance_of(USERS_ID[0]);

    service_client
        .accept_offer(offer)
        .send_recv(program_id)
        .await
        .unwrap();

    let new_balance = remoting.system().balance_of(USERS_ID[0]);
    assert!(new_balance - old_balance > (offer_price as f32 * 0.97) as u128);

    let token_info = nft_service_client
        .get_token_info(0)
        .recv(nft_address)
        .await
        .unwrap();
    assert_eq!(token_info.token_owner, USERS_ID[1].into());
}
