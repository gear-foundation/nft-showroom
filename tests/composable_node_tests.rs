use nft_marketplace_io::*;
use gclient::{
    errors::{Gear, ModuleError},
    Error as GclientError, EventListener, EventProcessor, GearApi, Result,
};
use gear_core::ids::CodeId;
use gstd::Encode;
use composable_nft_io::{Config as ComposableConfig, ComposableNftInit};
use primitive_types::H256;


const ALICE: [u8; 32] = [
    212, 53, 147, 199, 21, 253, 211, 28, 97, 20, 26, 189, 4, 169, 159, 214, 130, 44, 133, 88, 133,
    76, 205, 227, 154, 86, 132, 231, 165, 109, 162, 125,
];

#[tokio::test]
#[ignore]
async fn create_test() -> Result<()> {
    let api = GearApi::dev_from_path("target/tmp/gear").await?;

    let mut listener = api.subscribe().await?; // Subscribing for events.

    // Checking that blocks still running.
    assert!(listener.blocks_running().await?);

    let mut img_links: Vec<Vec<String>> = Vec::with_capacity(4);

    for k in 0..10 {
        let inner_vec: Vec<String> = (0..10)
            .map(|i| format!("Value{}-{}", k, i))
            .collect();

            img_links.push(inner_vec);
    }

    let init_nft_payload = ComposableNftInit{
        owner: 100.into(),
        config: ComposableConfig {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection image".to_string(),
            tokens_limit:  Some(500),
            mint_limit: 3.into(),
            transferable: true,
            approvable: true,
            burnable: true,
        },
        img_links,
    }.encode();

    println!("!!!!!!");

    let path = "target/wasm32-unknown-unknown/debug/composable_nft.opt.wasm";

    let gas_info = api
        .calculate_upload_gas(
            None,
            gclient::code_from_os(path)?,
            init_nft_payload.clone(),
            0,
            true,
        )
        .await?;

    println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());

    let (message_id, program_id, _hash) = api
        .upload_program_bytes(
            gclient::code_from_os(path)?,
            gclient::now_micros().to_le_bytes(),
            init_nft_payload,
            gas_info.min_limit,
            0,
        )
        .await?;

    println!("!!!!!!");
    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    Ok(())

}


// #[tokio::test]
// async fn create_test() -> Result<()> {
//     let api = GearApi::dev_from_path("target/tmp/gear").await?;

//     let mut listener = api.subscribe().await?; // Subscribing for events.

//     // Checking that blocks still running.
//     assert!(listener.blocks_running().await?);

//     let init_marketplace = NftMarketplaceInit {
//         gas_for_creation: 1_000_000_000,
//         time_between_create_collections: 3_600_000, // 1 hour in milliseconds
//     }.encode();

//     println!("!!!!!!");

//     let path = "target/wasm32-unknown-unknown/debug/nft_marketplace.opt.wasm";

//     let gas_info = api
//         .calculate_upload_gas(
//             None,
//             gclient::code_from_os(path)?,
//             init_marketplace.clone(),
//             0,
//             true,
//         )
//         .await?;

//     let (message_id, program_id, _hash) = api
//         .upload_program_bytes(
//             gclient::code_from_os(path)?,
//             gclient::now_micros().to_le_bytes(),
//             init_marketplace,
//             gas_info.min_limit,
//             0,
//         )
//         .await?;

//     assert!(listener.message_processed(message_id).await?.succeed());

//     println!("!!!!!!");
//     let composable_nft_code_id = upload_code_by_path(
//         &api,
//         "target/wasm32-unknown-unknown/debug/composable_nft.opt.wasm",
//     )
//     .await?;

//     println!("!!!!!!");

//     let add_collection_payload = NftMarketplaceAction::AddNewCollection {
//         code_id: composable_nft_code_id.into(),
//         meta_link: String::from("My Meta"),
//         name: String::from("MyCollection"),
//         description: String::from("My Collection"),
//     };
//     println!("!!!!!!");
//     let gas_info = api
//         .calculate_handle_gas(None, program_id, add_collection_payload.encode(), 0, true)
//         .await?;
//     println!("!!!!!!");
//     let (message_id, _) = api
//         .send_message(program_id, add_collection_payload, gas_info.min_limit, 0)
//         .await?;
//     println!("!!!!!!");

//     let mut img_links: Vec<Vec<String>> = Vec::with_capacity(4);

//     for k in 0..4 {
//         let inner_vec: Vec<String> = (0..10)
//             .map(|i| format!("Value{}-{}", k, i))
//             .collect();

//             img_links.push(inner_vec);
//     }

//     // Successful creation of a new collection
//     let init_nft_payload = ComposableNftInit{
//         owner: 100.into(),
//         config: ComposableConfig {
//             name: "User Collection".to_string(),
//             description: "User Collection".to_string(),
//             mint_limit: 3.into(),
//             transferable: true,
//             approvable: true,
//             burnable: true,
//             extension: true
//         },
//         nft_number: 100,
//         img_links,
//     }.encode();
//     println!("@@@@@@@@");

//     let create_collection_payload = NftMarketplaceAction::CreateCollection {
//         id_collection: 1,
//         payload: init_nft_payload,
//     };
//     let gas_info = api
//         .calculate_handle_gas(None, program_id, create_collection_payload.encode(), 0, true)
//         .await?;

//     println!("GAS_INFO MIN LIMIT: {:?}", gas_info.min_limit.clone());
//     let (message_id, _) = api
//         .send_message(program_id, create_collection_payload, gas_info.min_limit, 0)
//         .await?;
//     println!("@@@@@@@");



//     assert!(listener.message_processed(message_id).await?.succeed());

//     assert!(listener.blocks_running().await?);

//     Ok(())
// }
