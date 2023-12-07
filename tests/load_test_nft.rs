use gclient::{EventProcessor, GearApi, Result, WSAddress};
use gear_core::ids::ProgramId;
use gstd::{ActorId, Encode};
use nft_io::{Config, NftAction, NftInit};
use std::fs::read_to_string;

const USERS: &[u64] = &[5, 6, 7, 8];

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

fn read_lines(filename: &str) -> Vec<String> {
    let mut result = Vec::new();

    for line in read_to_string(filename).unwrap().lines() {
        result.push(line.to_string())
    }

    result
}

#[tokio::test]
#[ignore]
async fn transfer_balances() -> Result<()> {
    let users = read_lines("tests/accounts_50k.txt");

    let n = 1000;
    let i = 0;
    let res = tokio::join!(
        transfer_balances_to_account(&users[0..n], (i as u32) * 25),
        transfer_balances_to_account(&users[n..2 * n], 1 + (i as u32) * 25),
        transfer_balances_to_account(&users[2 * n..3 * n], 2 + (i as u32) * 25),
        transfer_balances_to_account(&users[3 * n..4 * n], 3 + (i as u32) * 25),
        transfer_balances_to_account(&users[4 * n..5 * n], 4 + (i as u32) * 25),
        transfer_balances_to_account(&users[5 * n..6 * n], 5 + (i as u32) * 25),
        transfer_balances_to_account(&users[6 * n..7 * n], 6 + (i as u32) * 25),
        transfer_balances_to_account(&users[7 * n..8 * n], 7 + (i as u32) * 25),
        transfer_balances_to_account(&users[8 * n..9 * n], 8 + (i as u32) * 25),
        transfer_balances_to_account(&users[9 * n..10 * n], 9 + (i as u32) * 25),
        transfer_balances_to_account(&users[10 * n..11 * n], 10 + (i as u32) * 25),
        transfer_balances_to_account(&users[11 * n..12 * n], 11 + (i as u32) * 25),
        transfer_balances_to_account(&users[12 * n..13 * n], 12 + (i as u32) * 25),
        transfer_balances_to_account(&users[13 * n..14 * n], 13 + (i as u32) * 25),
        transfer_balances_to_account(&users[14 * n..15 * n], 14 + (i as u32) * 25),
        transfer_balances_to_account(&users[15 * n..16 * n], 15 + (i as u32) * 25),
        transfer_balances_to_account(&users[16 * n..17 * n], 16 + (i as u32) * 25),
        transfer_balances_to_account(&users[17 * n..18 * n], 17 + (i as u32) * 25),
        transfer_balances_to_account(&users[18 * n..19 * n], 18 + (i as u32) * 25),
        transfer_balances_to_account(&users[19 * n..20 * n], 19 + (i as u32) * 25),
        transfer_balances_to_account(&users[20 * n..21 * n], 20 + (i as u32) * 25),
        transfer_balances_to_account(&users[21 * n..22 * n], 21 + (i as u32) * 25),
        transfer_balances_to_account(&users[22 * n..23 * n], 22 + (i as u32) * 25),
        transfer_balances_to_account(&users[23 * n..24 * n], 23 + (i as u32) * 25),
        transfer_balances_to_account(&users[24 * n..25 * n], 24 + (i as u32) * 25),
    );
    if let Err(error) = res.0 {
        println!("{:?}", error);
    }
    Ok(())
}

async fn transfer_balances_to_account(accounts: &[String], nonce: u32) -> Result<()> {
    let mut api = GearApi::dev().await?;
    // let mut api = GearApi::init(WSAddress::new("ws://localhost:9944", 9944)).await?;
    // let mut api = GearApi::dev_from_path("target/tmp/gear").await?;
    // let mut api = GearApi::init(WSAddress::new("wss://testnet.vara.rs", 443)).await?;
    let accounts = accounts.to_vec();
    for (_, account) in accounts.iter().enumerate() {
        let account = api.get_specific_actor_id(account);

        let account: [u8; 32] = account.into();
        let account: ProgramId = account.into();
        let rpc_nonce = api.rpc_nonce().await?;
        println!("RPC NONCE {:?}", rpc_nonce);
        api.set_nonce(rpc_nonce + nonce as u64);
        api.transfer(account, 100_000_000_000_000).await?;
        println!("Transferred");
        println!("{:?}", api.total_balance(account).await.expect(""));
    }

    Ok(())
}

#[tokio::test]
#[ignore]
async fn load_testing_nft() -> Result<()> {
    // let mut api = GearApi::dev_from_path("target/tmp/gear").await?;
    let mut api = GearApi::dev().await?;

    let mut listener = api.subscribe().await?; // Subscribing for events.

    // Checking that blocks still running.
    assert!(listener.blocks_running().await?);

    let img_links: Vec<(String, u32)> = (0..70_000)
        .map(|i| (format!("Img-{}", i), 1 as u32))
        .collect();

    let init_nft_payload = NftInit {
        owner: USERS[0].into(),
        config: Config {
            name: "User Collection".to_string(),
            description: "User Collection".to_string(),
            collection_img: "Collection Image".to_string(),
            collection_tags: vec!["tag1".to_string()],
            user_mint_limit: 3.into(),
            transferable: true,
            approvable: true,
            burnable: true,
            sellable: true,
            attendable: true,
        },
        img_links,
    }
    .encode();

    //println!("!!!!!! {:?}", init_nft_payload);

    let path = "target/wasm32-unknown-unknown/debug/nft.opt.wasm";

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

    let users = read_lines("tests/accounts_50k.txt");
    let n = 350;

    let res = tokio::join!(
        mint_from_account(program_id, &users[0..n]),
        mint_from_account(program_id, &users[n..2 * n]),
        mint_from_account(program_id, &users[2 * n..3 * n]),
        mint_from_account(program_id, &users[3 * n..4 * n]),
        mint_from_account(program_id, &users[4 * n..5 * n]),
        mint_from_account(program_id, &users[5 * n..6 * n]),
        mint_from_account(program_id, &users[6 * n..7 * n]),
        mint_from_account(program_id, &users[7 * n..8 * n]),
        mint_from_account(program_id, &users[8 * n..9 * n]),
        mint_from_account(program_id, &users[9 * n..10 * n]),
        mint_from_account(program_id, &users[10 * n..11 * n],),
        mint_from_account(program_id, &users[11 * n..12 * n],),
        mint_from_account(program_id, &users[12 * n..13 * n],),
        mint_from_account(program_id, &users[13 * n..14 * n],),
        mint_from_account(program_id, &users[14 * n..15 * n],),
        mint_from_account(program_id, &users[15 * n..16 * n],),
        mint_from_account(program_id, &users[16 * n..17 * n],),
        mint_from_account(program_id, &users[17 * n..18 * n],),
        mint_from_account(program_id, &users[18 * n..19 * n],),
        mint_from_account(program_id, &users[19 * n..20 * n],),
        mint_from_account(program_id, &users[20 * n..21 * n],),
        mint_from_account(program_id, &users[21 * n..22 * n],),
        mint_from_account(program_id, &users[22 * n..23 * n],),
        mint_from_account(program_id, &users[23 * n..24 * n],),
        mint_from_account(program_id, &users[24 * n..25 * n],),
    );

    if let Err(error) = res.0 {
        println!("Error {:?}", error);
    }

    Ok(())
}

async fn mint_from_account(program_id: ProgramId, accounts: &[String]) -> Result<()> {
    // let mut api = GearApi::init(WSAddress::new("wss://testnet.vara.rs", 443)).await?;
    // let mut api = GearApi::init(WSAddress::new("wss://vit.vara-network.io", 443)).await?;

    let mut api = GearApi::dev().await?;
    let accounts = accounts.to_vec();
    for (i, account) in accounts.iter().enumerate() {
        api = api
            .clone()
            .with(account)
            .expect("Unable to log with indicated account");

        let _account = api.get_actor_id();

        let _account: [u8; 32] = _account.into();
        //  let hex_string = format!("{:x}", account.to_ascii_lowercase());
        let _account: ProgramId = _account.into();

        let mint_payload = NftAction::Mint;
        let gas_info = api
            .calculate_handle_gas(None, program_id, mint_payload.encode(), 0, true)
            .await?;
        println!("GAS INFO {:?}", gas_info);
        println!("Balance {:?}", api.total_balance(_account).await.expect(""));
        if i > 0 {
            match api.total_balance(_account).await {
                Ok(balance) => {
                    println!("i {} balance {} ", i, balance);
                    api.send_message(program_id, mint_payload, 200_000_000_000, 0)
                        .await?;
                    println!("Minted");
                }
                Err(error) => {
                    println!("Error {:?}", error);
                }
            }
        }
    }

    Ok(())
}
