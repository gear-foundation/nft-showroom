use gclient::{EventProcessor, GearApi, Result};
use gear_core::ids::ProgramId;
use gstd::prelude::*;
use nft_marketplace_io::*;
use std::time::Instant;
mod utils_gclient;
use serial_test::serial;
use utils_gclient::*;

#[tokio::test]
#[ignore]
async fn create_test() -> Result<()> {
    let api = GearApi::dev_from_path("target/tmp/gear").await?;

    let mut listener = api.subscribe().await?; // Subscribing for events.
    assert!(listener.blocks_running().await?);

    let royalty_to_marketplace = 200;

    let (message_id, program_id) = init_marketplace(&api)
        .await
        .expect("Error init marketplace");
    assert!(listener.message_processed(message_id).await?.succeed());

    let message_id = add_new_collection(&api, program_id)
        .await
        .expect("Error add new collection");
    assert!(listener.message_processed(message_id).await?.succeed());

    let message_id = create_collection(&api, program_id)
        .await
        .expect("Error create collection");
    assert!(listener.message_processed(message_id).await?.succeed());

    // Check marketplace balance
    let marketplace_balance = api.total_balance(program_id).await?;
    assert_eq!(marketplace_balance, 10_000_000_000_000, "Wrong value");

    // Check that collection created
    let state = get_all_collection_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");
    assert!(!state.is_empty(), "Collections shouldn't be empty");

    // get the address and ProgramId of the created collection
    let address_nft = state[0].0;
    let address_nft_list = address_nft.as_ref();
    let nft_pid: ProgramId = address_nft_list.into();

    // Check collection state
    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");
    assert_eq!(state.collection_owner, USERS[0].into(), "Wrong Admin");

    let percent_to_marketplace = 10_000_000_000_000 * royalty_to_marketplace as u128 / 10_000;
    let payment_for_mint = 10_000_000_000_000 + percent_to_marketplace;
    let message_id = mint(&api, program_id, address_nft, payment_for_mint)
        .await
        .expect("Error mint");
    assert!(listener.message_processed(message_id).await?.succeed());

    // Check marketplace balance
    let marketplace_balance_after_mint = api.total_balance(program_id).await?;
    assert_eq!(
        marketplace_balance_after_mint,
        marketplace_balance + percent_to_marketplace,
        "Wrong value"
    );

    // Check success of mint
    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    assert!(!state.tokens.is_empty());
    assert_eq!(state.img_links_and_data.len(), 9);

    Ok(())
}

#[tokio::test]
#[serial]
#[ignore]
async fn sale_test() -> Result<()> {
    let api = GearApi::dev_from_path("target/tmp/gear").await?;

    let mut listener = api.subscribe().await?; // Subscribing for events.
    assert!(listener.blocks_running().await?);

    let royalty_to_marketplace = 200;

    let (message_id, program_id) = init_marketplace(&api)
        .await
        .expect("Error init marketplace");
    assert!(listener.message_processed(message_id).await?.succeed());

    let message_id = add_new_collection(&api, program_id)
        .await
        .expect("Error add new collection");
    assert!(listener.message_processed(message_id).await?.succeed());

    let message_id = create_collection(&api, program_id)
        .await
        .expect("Error create collection");
    assert!(listener.message_processed(message_id).await?.succeed());

    // Check marketplace balance
    let marketplace_balance = api.total_balance(program_id).await?;
    assert_eq!(marketplace_balance, 10_000_000_000_000, "Wrong value");

    // Check that collection created
    let state = get_all_collection_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");
    assert!(!state.is_empty(), "Collections shouldn't be empty");

    // get the address and ProgramId of the created collection
    let address_nft = state[0].0;
    let address = address_nft.as_ref();
    let nft_pid: ProgramId = address.into();

    // Check collection state
    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");
    assert_eq!(state.collection_owner, USERS[0].into(), "Wrong Admin");

    let percent_to_marketplace = 10_000_000_000_000 * royalty_to_marketplace as u128 / 10_000;
    let payment_for_mint = 10_000_000_000_000 + percent_to_marketplace;
    let message_id = mint(&api, program_id, address_nft, payment_for_mint)
        .await
        .expect("Error mint");
    assert!(listener.message_processed(message_id).await?.succeed());

    // Check marketplace balance
    let marketplace_balance_after_mint = api.total_balance(program_id).await?;
    assert_eq!(
        marketplace_balance_after_mint,
        marketplace_balance + percent_to_marketplace,
        "Wrong value"
    );

    // Check success of mint
    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");
    assert!(!state.tokens.is_empty());
    assert_eq!(state.img_links_and_data.len(), 9);

    // Approve to marketplace
    let message_id = approve(&api, program_id, nft_pid)
        .await
        .expect("Error approve");
    assert!(listener.message_processed(message_id).await?.succeed());

    let price = 150_000_000_000_000;
    let percent_to_marketplace = price * royalty_to_marketplace as u128 / 10_000;

    // Sale
    let sale_payload = NftMarketplaceAction::SaleNft {
        collection_address: address_nft,
        token_id: 0,
        price,
    };
    let gas_info = api
        .calculate_handle_gas(None, program_id, sale_payload.encode(), 0, true)
        .await?;
    let (message_id, _) = api
        .send_message(program_id, sale_payload, gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

    let client = get_new_client(&api, USERS_STR[0]).await;
    let mut client_listener = client.subscribe().await?;

    // Buy
    let buy_payload = NftMarketplaceAction::BuyNft {
        collection_address: address_nft,
        token_id: 0,
    };
    let gas_info = api
        .calculate_handle_gas(
            None,
            program_id,
            buy_payload.encode(),
            150_000_000_000_000,
            true,
        )
        .await?;

    let (message_id, _) = client
        .send_message(
            program_id,
            buy_payload,
            gas_info.min_limit,
            150_000_000_000_000,
        )
        .await?;
    assert!(client_listener
        .message_processed(message_id)
        .await?
        .succeed());

    // Check success of sale
    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    let token = state.tokens.get(0).expect("Can't be None");
    assert_eq!(token.0, 0);
    assert_eq!(token.1.owner, api.get_specific_actor_id(USERS_STR[0]));

    // check balance of marketplace
    let marketplace_balance_after_sale = api.total_balance(program_id).await?;
    assert_eq!(
        marketplace_balance_after_sale,
        marketplace_balance_after_mint + percent_to_marketplace,
        "Wrong value"
    );

    Ok(())
}

#[tokio::test]
#[ignore]
async fn auction_test() -> Result<()> {
    let api = GearApi::dev_from_path("target/tmp/gear").await?;

    let mut listener = api.subscribe().await?; // Subscribing for events.
    assert!(listener.blocks_running().await?);

    let royalty_to_marketplace = 200;

    let (message_id, program_id) = init_marketplace(&api)
        .await
        .expect("Error init marketplace");
    assert!(listener.message_processed(message_id).await?.succeed());

    let message_id = add_new_collection(&api, program_id)
        .await
        .expect("Error add new collection");
    assert!(listener.message_processed(message_id).await?.succeed());

    let message_id = create_collection(&api, program_id)
        .await
        .expect("Error create collection");
    assert!(listener.message_processed(message_id).await?.succeed());

    // Check marketplace balance
    let marketplace_balance = api.total_balance(program_id).await?;
    assert_eq!(marketplace_balance, 10_000_000_000_000, "Wrong value");

    // Check that collection created
    let state = get_all_collection_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");
    assert!(!state.is_empty(), "Collections shouldn't be empty");

    // get the address and ProgramId of the created collection
    let address_nft = state[0].0;
    let address_nft_list = address_nft.as_ref();
    let nft_pid: ProgramId = address_nft_list.into();

    // Check collection state
    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");
    assert_eq!(state.collection_owner, USERS[0].into(), "Wrong Admin");

    let percent_to_marketplace = 10_000_000_000_000 * royalty_to_marketplace as u128 / 10_000;
    let payment_for_mint = 10_000_000_000_000 + percent_to_marketplace;
    let message_id = mint(&api, program_id, address_nft, payment_for_mint)
        .await
        .expect("Error mint");
    assert!(listener.message_processed(message_id).await?.succeed());

    // Check marketplace balance
    let marketplace_balance_after_mint = api.total_balance(program_id).await?;
    assert_eq!(
        marketplace_balance_after_mint,
        marketplace_balance + percent_to_marketplace,
        "Wrong value"
    );

    // Check success of mint
    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    assert!(!state.tokens.is_empty());
    assert_eq!(state.img_links_and_data.len(), 9);

    // Approve to marketplace
    let message_id = approve(&api, program_id, nft_pid)
        .await
        .expect("Error approve");
    assert!(listener.message_processed(message_id).await?.succeed());

    // Create auction
    let duration_in_block = 12;
    let duration_in_secs = 36; // 36 secs
    let create_auction_payload = NftMarketplaceAction::CreateAuction {
        collection_address: address_nft,
        token_id: 0,
        min_price: 11_000_000_000_000,
        duration: duration_in_block,
    };

    let gas_info = api
        .calculate_handle_gas(None, program_id, create_auction_payload.encode(), 0, true)
        .await?;
    let (message_id, _) = api
        .send_message(program_id, create_auction_payload, gas_info.min_limit, 0)
        .await?;

    let start = Instant::now();
    assert!(listener.message_processed(message_id).await?.succeed());

    // Check state
    let state = get_marketplace_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");
    assert!(!state.auctions.is_empty());

    // Add bid
    let client = get_new_client(&api, USERS_STR[0]).await;
    let mut client_listener = client.subscribe().await?;
    let add_bid_payload = NftMarketplaceAction::AddBid {
        collection_address: address_nft,
        token_id: 0,
    };

    let bid = 150_000_000_000_000;
    let percent_to_marketplace = bid * royalty_to_marketplace as u128 / 10_000;

    let gas_info = api
        .calculate_handle_gas(None, program_id, add_bid_payload.encode(), bid, true)
        .await?;
    let (message_id, _) = client
        .send_message(program_id, add_bid_payload, gas_info.min_limit, bid)
        .await?;
    assert!(client_listener
        .message_processed(message_id)
        .await?
        .succeed());

    let duration = start.elapsed().as_secs();
    std::thread::sleep(std::time::Duration::from_secs(duration_in_secs - duration));

    // Check success of close auction
    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    let token = state.tokens.get(0).expect("Can't be None");
    assert_eq!(token.0, 0);
    assert_eq!(token.1.owner, api.get_specific_actor_id(USERS_STR[0]));

    // Check marketplace balance
    let marketplace_balance_after_auction = api.total_balance(program_id).await?;
    assert_eq!(
        marketplace_balance_after_auction,
        marketplace_balance_after_mint + percent_to_marketplace,
        "Wrong value"
    );

    Ok(())
}

#[tokio::test]
#[ignore]
async fn offer_test() -> Result<()> {
    let api = GearApi::dev_from_path("target/tmp/gear").await?;

    let mut listener = api.subscribe().await?; // Subscribing for events.
    assert!(listener.blocks_running().await?);

    let royalty_to_marketplace = 200;

    let (message_id, program_id) = init_marketplace(&api)
        .await
        .expect("Error init marketplace");
    assert!(listener.message_processed(message_id).await?.succeed());

    let message_id = add_new_collection(&api, program_id)
        .await
        .expect("Error add new collection");
    assert!(listener.message_processed(message_id).await?.succeed());

    let message_id = create_collection(&api, program_id)
        .await
        .expect("Error create collection");
    assert!(listener.message_processed(message_id).await?.succeed());

    // Check marketplace balance
    let marketplace_balance = api.total_balance(program_id).await?;
    assert_eq!(marketplace_balance, 10_000_000_000_000, "Wrong value");

    // Check that collection created
    let state = get_all_collection_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");
    assert!(!state.is_empty(), "Collections shouldn't be empty");

    // get the address and ProgramId of the created collection
    let address_nft = state[0].0;
    let address_nft_list = address_nft.as_ref();
    let nft_pid: ProgramId = address_nft_list.into();

    // Check collection state
    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");
    assert_eq!(state.collection_owner, USERS[0].into(), "Wrong Admin");

    let percent_to_marketplace = 10_000_000_000_000 * royalty_to_marketplace as u128 / 10_000;
    let payment_for_mint = 10_000_000_000_000 + percent_to_marketplace;
    let message_id = mint(&api, program_id, address_nft, payment_for_mint)
        .await
        .expect("Error mint");
    assert!(listener.message_processed(message_id).await?.succeed());

    // Check marketplace balance
    let marketplace_balance_after_mint = api.total_balance(program_id).await?;
    assert_eq!(
        marketplace_balance_after_mint,
        marketplace_balance + percent_to_marketplace,
        "Wrong value"
    );

    // Check success of mint
    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");

    assert!(!state.tokens.is_empty());
    assert_eq!(state.img_links_and_data.len(), 9);

    // Create offer
    let client = get_new_client(&api, USERS_STR[0]).await;
    let mut client_listener = client.subscribe().await?;
    let create_offer_payload = NftMarketplaceAction::CreateOffer {
        collection_address: address_nft,
        token_id: 0,
    };

    let offer_price = 150_000_000_000_000;
    let percent_to_marketplace = offer_price * royalty_to_marketplace as u128 / 10_000;

    let gas_info = client
        .calculate_handle_gas(
            None,
            program_id,
            create_offer_payload.encode(),
            offer_price,
            true,
        )
        .await?;
    let (message_id, _) = client
        .send_message(
            program_id,
            create_offer_payload,
            gas_info.min_limit,
            offer_price,
        )
        .await?;

    assert!(client_listener
        .message_processed(message_id)
        .await?
        .succeed());

    // Check state
    let state = get_marketplace_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");
    assert!(!state.offers.is_empty());

    // Approve to marketplace
    let message_id = approve(&api, program_id, nft_pid)
        .await
        .expect("Error approve");
    assert!(listener.message_processed(message_id).await?.succeed());

    // Accept offer
    let offer = Offer {
        collection_address: address_nft,
        token_id: 0,
        creator: api.get_specific_actor_id(USERS_STR[0]),
    };
    let accept_offer_payload = NftMarketplaceAction::AcceptOffer { offer };
    let gas_info = api
        .calculate_handle_gas(None, program_id, accept_offer_payload.encode(), 0, true)
        .await?;
    let (message_id, _) = api
        .send_message(program_id, accept_offer_payload, gas_info.min_limit, 0)
        .await?;
    assert!(listener.message_processed(message_id).await?.succeed());

    // Check state offers
    let state = get_marketplace_state(&api, &program_id)
        .await
        .expect("Unexpected invalid state.");
    assert!(state.offers.is_empty());

    // Check success of accept offer
    let state = get_all_state_nft(&api, &nft_pid)
        .await
        .expect("Unexpected invalid state.");
    let token = state.tokens.get(0).expect("Can't be None");
    assert_eq!(token.0, 0);
    assert_eq!(token.1.owner, api.get_specific_actor_id(USERS_STR[0]));

    // Check balance
    let marketplace_balance_after_offer = api.total_balance(program_id).await?;
    assert_eq!(
        marketplace_balance_after_offer,
        marketplace_balance_after_mint + percent_to_marketplace,
        "Wrong value"
    );

    Ok(())
}
