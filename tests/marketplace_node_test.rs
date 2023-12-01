use nft_marketplace_io::*;
use gclient::{
    errors::{Gear, ModuleError},
    Error as GclientError, EventListener, EventProcessor, GearApi, Result,
};
use gstd::{prelude::*, ActorId};
use nft_io::{Config, NftAction, NftInit, StateQuery as StateQueryNft, StateReply as StateReplyNft, NftState};
use gear_core::ids::ProgramId;

const USERS: &[u64] = &[5, 6, 7, 8];

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
    }.encode();

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

    let (nft_code_id, _) = api.upload_code_by_path(
        "target/wasm32-unknown-unknown/debug/nft.opt.wasm",
    )
    .await?;

    let nft_code_id: [u8; 32] = nft_code_id.into();

    let add_collection_payload = NftMarketplaceAction::AddNewCollection {
        code_id: nft_code_id.into(),
        meta_link: String::from("My Meta"),
        description: String::from("My Collection"),
    };

    let gas_info = api
        .calculate_handle_gas(None, program_id, add_collection_payload.encode(), 0, true)
        .await?;

    let (message_id, _) = api
        .send_message(program_id, add_collection_payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    let img_links: Vec<(String, u32)> = (0..10)
        .map(|i| (format!("Img-{}", i), 1 as u32))
        .collect();

    // Successful creation of a new collection
    let init_nft_payload = NftInit{
        owner: USERS[0].into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection Image".to_string(),
            mint_limit: 3.into(),
            transferable: true,
            approvable: true,
            burnable: true,
            sellable: true,
        },
        img_links,
    }.encode();

    let create_collection_payload = NftMarketplaceAction::CreateCollection {
        id_collection: 1,
        payload: init_nft_payload,
    };
    let gas_info = api
        .calculate_handle_gas(None, program_id, create_collection_payload.encode(), 0, true)
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
    let address_nft = state[0].1[0];

    let address_nft = address_nft.as_ref();
    //let address_nft = hex::decode(address_nft).unwrap();
    //let nft_pid = ProgramId::decode(&mut address_nft).unwrap();
    let nft_pid: ProgramId = address_nft.into();

    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    assert_eq!(state.admins[1], USERS[0].into(), "Wrong Admin");
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

pub async fn get_all_collection_state(api: &GearApi, program_id: &ProgramId) -> Option<Vec<(ActorId, Vec<ActorId>)>> {
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
