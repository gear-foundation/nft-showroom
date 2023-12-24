use gclient::{
    errors::{Gear, ModuleError},
    Error as GclientError, EventListener, EventProcessor, GearApi, Result,
};
use gear_core::ids::ProgramId;
use gstd::{prelude::*, ActorId};
use nft_io::{
    Config, ImageData, NftAction, NftInit, NftState, StateQuery as StateQueryNft,
    StateReply as StateReplyNft,
};
use nft_marketplace_io::*;

const USERS: &[u64] = &[5, 6, 7, 8];
pub const USERS_STR: &[&str] = &["//John", "//Mike", "//Dan"];
const ALICE: [u8; 32] = [
    212, 53, 147, 199, 21, 253, 211, 28, 97, 20, 26, 189, 4, 169, 159, 214, 130, 44, 133, 88, 133,
    76, 205, 227, 154, 86, 132, 231, 165, 109, 162, 125,
];

pub trait ApiUtils {
    fn get_actor_id(&self) -> ActorId;
    fn get_specific_actor_id(&self, value: impl AsRef<str>) -> ActorId;
}

impl ApiUtils for GearApi {
    fn get_actor_id(&self) -> ActorId {
        ActorId::new(
            self.account_id()
                .encode()
                .try_into()
                .expect("Unexpected invalid account id length."),
        )
    }

    fn get_specific_actor_id(&self, value: impl AsRef<str>) -> ActorId {
        let api_temp = self
            .clone()
            .with(value)
            .expect("Unable to build `GearApi` instance with provided signer.");
        api_temp.get_actor_id()
    }
}

#[tokio::test]
#[ignore]
async fn create_test() -> Result<()> {
    let api = GearApi::dev_from_path("target/tmp/gear").await?;

    let mut listener = api.subscribe().await?; // Subscribing for events.

    // Checking that blocks still running.
    assert!(listener.blocks_running().await?);

    let init_marketplace = NftMarketplaceInit {
        gas_for_creation: 200_000_000_000,
        time_between_create_collections: 3_600_000, // 1 hour in milliseconds
        minimum_transfer_value: 10_000_000_000_000,
    }
    .encode();

    let path = "target/wasm32-unknown-unknown/debug/nft_marketplace.opt.wasm";

    let gas_info = api
        .calculate_upload_gas(
            None,
            gclient::code_from_os(path)?,
            init_marketplace.clone(),
            0,
            true,
        )
        .await?;

    let (message_id, program_id, _hash) = api
        .upload_program_bytes(
            gclient::code_from_os(path)?,
            gclient::now_micros().to_le_bytes(),
            init_marketplace,
            gas_info.min_limit,
            0,
        )
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    let (nft_code_id, _) = api
        .upload_code_by_path("target/wasm32-unknown-unknown/debug/nft.opt.wasm")
        .await?;

    let nft_code_id: [u8; 32] = nft_code_id.into();

    let add_collection_payload = NftMarketplaceAction::AddNewCollection {
        code_id: nft_code_id.into(),
        meta_link: String::from("My Meta"),
        type_name: String::from("Simple NFT"),
        type_description: String::from("My Collection"),
    };

    let gas_info = api
        .calculate_handle_gas(None, program_id, add_collection_payload.encode(), 0, true)
        .await?;

    let (message_id, _) = api
        .send_message(program_id, add_collection_payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    let img_data = ImageData {
        limit_copies: 1,
        auto_changing_rules: None,
    };
    let img_links: Vec<(String, ImageData)> = (0..10)
        .map(|i| (format!("Img-{}", i), img_data.clone()))
        .collect();

    // Successful creation of a new collection
    let init_nft_payload = NftInit {
        collection_owner: USERS[0].into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            collection_logo: "Collection logo".to_string(),
            collection_tags: vec!["tag1".to_string()],
            additional_links: None,
            royalty: 0,
            user_mint_limit: Some(3),
            payment_for_mint: 0,
            transferable: Some(0),
            sellable: Some(0),
        },
        img_links,
    }
    .encode();

    let create_collection_payload = NftMarketplaceAction::CreateCollection {
        type_name: String::from("Simple NFT"),
        payload: init_nft_payload,
    };
    let gas_info = api
        .calculate_handle_gas(
            None,
            program_id,
            create_collection_payload.encode(),
            0,
            true,
        )
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(program_id, create_collection_payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let state = get_all_collection_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");

    assert!(!state.is_empty(), "Collections shouldn't be empty");
    println!("Collections: {:?}", state);
    let address_nft = state[0].0;

    let address_nft = address_nft.as_ref();
    //let address_nft = hex::decode(address_nft).unwrap();
    //let nft_pid = ProgramId::decode(&mut address_nft).unwrap();
    let nft_pid: ProgramId = address_nft.into();

    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    assert_eq!(state.collection_owner, USERS[0].into(), "Wrong Admin");
    println!("NFT Collection STATE: {:?}", state);

    let gas_info = api
        .calculate_handle_gas(None, nft_pid, NftAction::Mint.encode(), 0, true)
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(nft_pid, NftAction::Mint, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    assert!(!state.tokens.is_empty());
    assert_eq!(state.img_links.len(), 9);

    Ok(())
}

#[tokio::test]
#[ignore]
async fn sale_test() -> Result<()> {
    let api = GearApi::dev_from_path("target/tmp/gear").await?;

    let mut listener = api.subscribe().await?; // Subscribing for events.

    // Checking that blocks still running.
    assert!(listener.blocks_running().await?);

    let init_marketplace = NftMarketplaceInit {
        gas_for_creation: 200_000_000_000,
        time_between_create_collections: 3_600_000, // 1 hour in milliseconds
        minimum_transfer_value: 10_000_000_000_000,
    }
    .encode();

    let path = "target/wasm32-unknown-unknown/debug/nft_marketplace.opt.wasm";

    let gas_info = api
        .calculate_upload_gas(
            None,
            gclient::code_from_os(path)?,
            init_marketplace.clone(),
            0,
            true,
        )
        .await?;

    let (message_id, program_id, _hash) = api
        .upload_program_bytes(
            gclient::code_from_os(path)?,
            gclient::now_micros().to_le_bytes(),
            init_marketplace,
            gas_info.min_limit,
            0,
        )
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    let (nft_code_id, _) = api
        .upload_code_by_path("target/wasm32-unknown-unknown/debug/nft.opt.wasm")
        .await?;

    let nft_code_id: [u8; 32] = nft_code_id.into();

    let add_collection_payload = NftMarketplaceAction::AddNewCollection {
        code_id: nft_code_id.into(),
        meta_link: String::from("My Meta"),
        type_name: String::from("Simple NFT"),
        type_description: String::from("My Collection"),
    };

    let gas_info = api
        .calculate_handle_gas(None, program_id, add_collection_payload.encode(), 0, true)
        .await?;

    let (message_id, _) = api
        .send_message(program_id, add_collection_payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    let img_data = ImageData {
        limit_copies: 1,
        auto_changing_rules: None,
    };
    let img_links: Vec<(String, ImageData)> = (0..10)
        .map(|i| (format!("Img-{}", i), img_data.clone()))
        .collect();

    // Successful creation of a new collection
    let init_nft_payload = NftInit {
        collection_owner: ALICE.into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            collection_logo: "Collection logo".to_string(),
            collection_tags: vec!["tag1".to_string()],
            additional_links: None,
            royalty: 1_000,
            user_mint_limit: Some(3),
            payment_for_mint: 0,
            transferable: Some(0),
            sellable: Some(0),
        },
        img_links,
    }
    .encode();

    let create_collection_payload = NftMarketplaceAction::CreateCollection {
        type_name: String::from("Simple NFT"),
        payload: init_nft_payload,
    };
    let gas_info = api
        .calculate_handle_gas(
            None,
            program_id,
            create_collection_payload.encode(),
            0,
            true,
        )
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(program_id, create_collection_payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let state = get_all_collection_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");

    assert!(!state.is_empty(), "Collections shouldn't be empty");
    println!("Collections: {:?}", state);
    let address_nft = state[0].0;

    let address = address_nft.as_ref();
    //let address_nft = hex::decode(address_nft).unwrap();
    //let nft_pid = ProgramId::decode(&mut address_nft).unwrap();
    let nft_pid: ProgramId = address.into();

    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    assert_eq!(state.collection_owner, ALICE.into(), "Wrong Admin");
    println!("NFT Collection STATE: {:?}", state);

    let gas_info = api
        .calculate_handle_gas(None, nft_pid, NftAction::Mint.encode(), 0, true)
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(nft_pid, NftAction::Mint, gas_info.min_limit * 2, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    assert!(!state.tokens.is_empty());
    assert_eq!(state.img_links.len(), 9);

    let address_marketplace: ActorId = program_id.into_bytes().into();
    let gas_info = api
        .calculate_handle_gas(
            None,
            nft_pid,
            NftAction::Approve {
                to: address_marketplace,
                token_id: 0,
            }
            .encode(),
            0,
            true,
        )
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(
            nft_pid,
            NftAction::Approve {
                to: address_marketplace,
                token_id: 0,
            },
            gas_info.min_limit * 2,
            0,
        )
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let sale_payload = NftMarketplaceAction::SaleNft {
        collection_address: address_nft,
        token_id: 0,
        price: 150_000_000_000_000,
    };

    let gas_info = api
        .calculate_handle_gas(None, program_id, sale_payload.encode(), 0, true)
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(program_id, sale_payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let state = get_marketplace_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");
    println!("\nSTATE: {:?}", state);

    let alice_balance = api.total_balance(api.account_id()).await?;
    let amount = alice_balance / 10;
    println!("AMOUNT: {:?}", amount.clone());
    api.transfer(
        api.get_specific_actor_id(USERS_STR[0])
            .encode()
            .as_slice()
            .try_into()
            .expect("Unexpected invalid `ProgramId`."),
        amount,
    )
    .await?;

    let client = api
        .clone()
        .with(USERS_STR[0])
        .expect("Unable to change signer.");

    let mut client_listener = client.subscribe().await?;
    let buy_payload = NftMarketplaceAction::BuyNft {
        collection_address: address_nft,
        token_id: 0,
    };
    let gas_info = api
        .calculate_handle_gas(None, program_id, buy_payload.encode(), 0, true)
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = client
        .send_message(
            program_id,
            buy_payload,
            gas_info.min_limit * 2,
            150_000_000_000_000,
        )
        .await?;
    println!("!!!!!!!!!!!!!!!!!!!!");
    // assert!(client_listener.message_processed(message_id).await?.succeed());
    // assert!(client_listener.blocks_running().await?);

    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    let token = state.tokens.get(0).expect("Can't be None");
    assert_eq!(token.0, 0);
    assert_eq!(token.1.owner, api.get_specific_actor_id(USERS_STR[0]));

    Ok(())
}

#[tokio::test]
#[ignore]
async fn auction_test() -> Result<()> {
    let api = GearApi::dev_from_path("target/tmp/gear").await?;

    let mut listener = api.subscribe().await?; // Subscribing for events.

    // Checking that blocks still running.
    assert!(listener.blocks_running().await?);

    let init_marketplace = NftMarketplaceInit {
        gas_for_creation: 200_000_000_000,
        time_between_create_collections: 3_600_000, // 1 hour in milliseconds
        minimum_transfer_value: 10_000_000_000_000,
    }
    .encode();

    let path = "target/wasm32-unknown-unknown/debug/nft_marketplace.opt.wasm";

    let gas_info = api
        .calculate_upload_gas(
            None,
            gclient::code_from_os(path)?,
            init_marketplace.clone(),
            0,
            true,
        )
        .await?;

    let (message_id, program_id, _hash) = api
        .upload_program_bytes(
            gclient::code_from_os(path)?,
            gclient::now_micros().to_le_bytes(),
            init_marketplace,
            gas_info.min_limit,
            0,
        )
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    let (nft_code_id, _) = api
        .upload_code_by_path("target/wasm32-unknown-unknown/debug/nft.opt.wasm")
        .await?;

    let nft_code_id: [u8; 32] = nft_code_id.into();

    let add_collection_payload = NftMarketplaceAction::AddNewCollection {
        code_id: nft_code_id.into(),
        meta_link: String::from("My Meta"),
        type_name: String::from("Simple NFT"),
        type_description: String::from("My Collection"),
    };

    let gas_info = api
        .calculate_handle_gas(None, program_id, add_collection_payload.encode(), 0, true)
        .await?;

    let (message_id, _) = api
        .send_message(program_id, add_collection_payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    let img_data = ImageData {
        limit_copies: 1,
        auto_changing_rules: None,
    };
    let img_links: Vec<(String, ImageData)> = (0..10)
        .map(|i| (format!("Img-{}", i), img_data.clone()))
        .collect();

    // Successful creation of a new collection
    let init_nft_payload = NftInit {
        collection_owner: ALICE.into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            collection_logo: "Collection logo".to_string(),
            collection_tags: vec!["tag1".to_string()],
            additional_links: None,
            royalty: 1_000,
            user_mint_limit: Some(3),
            payment_for_mint: 0,
            transferable: Some(0),
            sellable: Some(0),
        },
        img_links,
    }
    .encode();

    let create_collection_payload = NftMarketplaceAction::CreateCollection {
        type_name: String::from("Simple NFT"),
        payload: init_nft_payload,
    };
    let gas_info = api
        .calculate_handle_gas(
            None,
            program_id,
            create_collection_payload.encode(),
            0,
            true,
        )
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(program_id, create_collection_payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let state = get_all_collection_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");

    assert!(!state.is_empty(), "Collections shouldn't be empty");
    println!("Collections: {:?}", state);
    let address_nft = state[0].0;

    let address = address_nft.as_ref();
    let nft_pid: ProgramId = address.into();

    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    assert_eq!(state.collection_owner, ALICE.into(), "Wrong Admin");
    println!("NFT Collection STATE: {:?}", state);

    let gas_info = api
        .calculate_handle_gas(None, nft_pid, NftAction::Mint.encode(), 0, true)
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(nft_pid, NftAction::Mint, gas_info.min_limit * 2, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    assert!(!state.tokens.is_empty());
    assert_eq!(state.img_links.len(), 9);

    let address_marketplace: ActorId = program_id.into_bytes().into();
    let gas_info = api
        .calculate_handle_gas(
            None,
            nft_pid,
            NftAction::Approve {
                to: address_marketplace,
                token_id: 0,
            }
            .encode(),
            0,
            true,
        )
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(
            nft_pid,
            NftAction::Approve {
                to: address_marketplace,
                token_id: 0,
            },
            gas_info.min_limit * 2,
            0,
        )
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let create_auction_payload = NftMarketplaceAction::CreateAuction {
        collection_address: address_nft,
        token_id: 0,
        min_price: 11_000_000_000_000,
        duration_ms: 50_000,
    };

    let gas_info = api
        .calculate_handle_gas(None, program_id, create_auction_payload.encode(), 0, true)
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(
            program_id,
            create_auction_payload,
            gas_info.min_limit * 2,
            0,
        )
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let state = get_marketplace_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");
    println!("\nSTATE: {:?}", state);

    let alice_balance = api.total_balance(api.account_id()).await?;
    let amount = alice_balance / 10;
    println!("AMOUNT: {:?}", amount.clone());
    api.transfer(
        api.get_specific_actor_id(USERS_STR[0])
            .encode()
            .as_slice()
            .try_into()
            .expect("Unexpected invalid `ProgramId`."),
        amount,
    )
    .await?;

    let client = api
        .clone()
        .with(USERS_STR[0])
        .expect("Unable to change signer.");

    let add_bid_payload = NftMarketplaceAction::AddBid {
        collection_address: address_nft,
        token_id: 0,
    };
    let gas_info = api
        .calculate_handle_gas(None, program_id, add_bid_payload.encode(), 0, true)
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = client
        .send_message(
            program_id,
            add_bid_payload,
            gas_info.min_limit * 2,
            150_000_000_000_000,
        )
        .await?;
    let state = get_marketplace_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");
    println!("\nSTATE: {:?}", state);
    // assert!(client_listener.message_processed(message_id).await?.succeed());
    // assert!(client_listener.blocks_running().await?);

    std::thread::sleep(std::time::Duration::from_secs(10));
    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    let token = state.tokens.get(0).expect("Can't be None");
    assert_eq!(token.0, 0);
    assert_eq!(token.1.owner, api.get_specific_actor_id(USERS_STR[0]));

    Ok(())
}

#[tokio::test]
#[ignore]
async fn offer_test() -> Result<()> {
    let api = GearApi::dev_from_path("target/tmp/gear").await?;

    let mut listener = api.subscribe().await?; // Subscribing for events.

    // Checking that blocks still running.
    assert!(listener.blocks_running().await?);

    let init_marketplace = NftMarketplaceInit {
        gas_for_creation: 200_000_000_000,
        time_between_create_collections: 3_600_000, // 1 hour in milliseconds
        minimum_transfer_value: 10_000_000_000_000,
    }
    .encode();

    let path = "target/wasm32-unknown-unknown/debug/nft_marketplace.opt.wasm";

    let gas_info = api
        .calculate_upload_gas(
            None,
            gclient::code_from_os(path)?,
            init_marketplace.clone(),
            0,
            true,
        )
        .await?;

    let (message_id, program_id, _hash) = api
        .upload_program_bytes(
            gclient::code_from_os(path)?,
            gclient::now_micros().to_le_bytes(),
            init_marketplace,
            gas_info.min_limit,
            0,
        )
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    let (nft_code_id, _) = api
        .upload_code_by_path("target/wasm32-unknown-unknown/debug/nft.opt.wasm")
        .await?;

    let nft_code_id: [u8; 32] = nft_code_id.into();

    let add_collection_payload = NftMarketplaceAction::AddNewCollection {
        code_id: nft_code_id.into(),
        meta_link: String::from("My Meta"),
        type_name: String::from("Simple NFT"),
        type_description: String::from("My Collection"),
    };

    let gas_info = api
        .calculate_handle_gas(None, program_id, add_collection_payload.encode(), 0, true)
        .await?;

    let (message_id, _) = api
        .send_message(program_id, add_collection_payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    let img_data = ImageData {
        limit_copies: 1,
        auto_changing_rules: None,
    };
    let img_links: Vec<(String, ImageData)> = (0..10)
        .map(|i| (format!("Img-{}", i), img_data.clone()))
        .collect();

    // Successful creation of a new collection
    let init_nft_payload = NftInit {
        collection_owner: ALICE.into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            collection_logo: "Collection logo".to_string(),
            collection_tags: vec!["tag1".to_string()],
            additional_links: None,
            royalty: 1_000,
            user_mint_limit: Some(3),
            payment_for_mint: 0,
            transferable: Some(0),
            sellable: Some(0),
        },
        img_links,
    }
    .encode();

    let create_collection_payload = NftMarketplaceAction::CreateCollection {
        type_name: String::from("Simple NFT"),
        payload: init_nft_payload,
    };
    let gas_info = api
        .calculate_handle_gas(
            None,
            program_id,
            create_collection_payload.encode(),
            0,
            true,
        )
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(program_id, create_collection_payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let state = get_all_collection_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");

    assert!(!state.is_empty(), "Collections shouldn't be empty");
    println!("Collections: {:?}", state);
    let address_nft = state[0].0;

    let address = address_nft.as_ref();
    //let address_nft = hex::decode(address_nft).unwrap();
    //let nft_pid = ProgramId::decode(&mut address_nft).unwrap();
    let nft_pid: ProgramId = address.into();

    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    assert_eq!(state.collection_owner, ALICE.into(), "Wrong Admin");
    println!("NFT Collection STATE: {:?}", state);

    let gas_info = api
        .calculate_handle_gas(None, nft_pid, NftAction::Mint.encode(), 0, true)
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(nft_pid, NftAction::Mint, gas_info.min_limit * 2, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    assert!(!state.tokens.is_empty());
    assert_eq!(state.img_links.len(), 9);

    let alice_balance = api.total_balance(api.account_id()).await?;
    let amount = alice_balance / 10;

    api.transfer(
        api.get_specific_actor_id(USERS_STR[0])
            .encode()
            .as_slice()
            .try_into()
            .expect("Unexpected invalid `ProgramId`."),
        amount,
    )
    .await?;

    let client = api
        .clone()
        .with(USERS_STR[0])
        .expect("Unable to change signer.");

    let mut client_listener = client.subscribe().await?;
    let create_offer_payload = NftMarketplaceAction::CreateOffer {
        collection_address: address_nft,
        token_id: 0,
    };

    let gas_info = client
        .calculate_handle_gas(None, program_id, create_offer_payload.encode(), 0, true)
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = client
        .send_message(
            program_id,
            create_offer_payload,
            gas_info.min_limit * 2,
            150_000_000_000_000,
        )
        .await?;

    assert!(client_listener
        .message_processed(message_id)
        .await?
        .succeed());
    assert!(client_listener.blocks_running().await?);

    let state = get_marketplace_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");

    assert!(!state.offers.is_empty());
    println!("\nSTATE: {:?}", state);

    let address_marketplace: ActorId = program_id.into_bytes().into();
    let gas_info = api
        .calculate_handle_gas(
            None,
            nft_pid,
            NftAction::Approve {
                to: address_marketplace,
                token_id: 0,
            }
            .encode(),
            0,
            true,
        )
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(
            nft_pid,
            NftAction::Approve {
                to: address_marketplace,
                token_id: 0,
            },
            gas_info.min_limit * 2,
            0,
        )
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let offer = Offer {
        collection_address: address_nft,
        token_id: 0,
        creator: api.get_specific_actor_id(USERS_STR[0]),
    };

    let accept_offer_payload = NftMarketplaceAction::AcceptOffer { offer };
    let gas_info = api
        .calculate_handle_gas(None, program_id, accept_offer_payload.encode(), 0, true)
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
    let (message_id, _) = api
        .send_message(program_id, accept_offer_payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    let state = get_marketplace_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");

    println!("\nSTATE: {:?}", state);
    assert!(state.offers.is_empty());

    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    let token = state.tokens.get(0).expect("Can't be None");
    assert_eq!(token.0, 0);
    assert_eq!(token.1.owner, api.get_specific_actor_id(USERS_STR[0]));

    Ok(())
}

pub async fn get_all_state_nft(api: &GearApi, program_id: &ProgramId) -> Option<NftState> {
    let reply = api
        .read_state(*program_id, StateQueryNft::All.encode())
        .await
        .expect("Unexpected invalid reply.");
    if let StateReplyNft::All(state) = reply {
        Some(state)
    } else {
        None
    }
}

pub async fn get_all_collection_state(
    api: &GearApi,
    program_id: &ProgramId,
) -> Option<Vec<(ActorId, ActorId)>> {
    let reply = api
        .read_state(*program_id, StateQuery::AllCollections.encode())
        .await
        .expect("Unexpected invalid reply.");
    if let StateReply::AllCollections(state) = reply {
        Some(state)
    } else {
        None
    }
}

pub async fn get_marketplace_state(api: &GearApi, program_id: &ProgramId) -> Option<State> {
    let reply = api
        .read_state(*program_id, StateQuery::All.encode())
        .await
        .expect("Unexpected invalid reply.");
    if let StateReply::All(state) = reply {
        Some(state)
    } else {
        None
    }
}
