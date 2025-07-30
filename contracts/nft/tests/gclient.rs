use anyhow::Context;
use gclient::{EventListener, EventProcessor, GearApi, Result};
use sails_rs::{ActorId, Encode};
use serde::Deserialize;
use std::{cmp::Ordering, collections::HashMap, env, fs};

#[macro_export]
macro_rules! send_request {
    (api: $api:expr, program_id: $program_id:expr, service_name: $name:literal, action: $action:literal, payload: ($($val:expr),*)) => {
        $crate::send_request!(api: $api, program_id: $program_id, service_name: $name, action: $action, payload: ($($val),*), value: 0)
    };

    (api: $api:expr, program_id: $program_id:expr, service_name: $name:literal, action: $action:literal, payload: ($($val:expr),*), value: $value:expr) => {
        {
            let request = [
                $name.encode(),
                $action.to_string().encode(),
                ($($val),*).encode(),
            ].concat();

            let (message_id, _) = $api
                .send_message_bytes($program_id, request.clone(), 749_000_000_000, $value)
                .await?;

            message_id
        }
    };
}

#[tokio::test]
async fn test_migration() -> Result<()> {
    // let api = GearApi::dev().await?;

    // let mut listener = api.subscribe().await?;
    // assert!(listener.blocks_running().await?);

    let path = "tests/migration-states/state-1.json";
    let json = fs::read_to_string(path).context(format!("cannot read {path}"))?;
    let root: Root = serde_json::from_str(&json).context("invalid json")?;

    let mut tokens = root.all.tokens;
    tokens.sort_by(|(id_a, a), (id_b, b)| sort_tokens(id_a, a, id_b, b));

    for (token_id_str, token) in tokens {
        let media_fragment = token.media_url.as_str();

        // Поиск первого индекса, где media_url входит в ссылку
        let img_id_opt = root
            .all
            .img_links_and_data
            .iter()
            .enumerate()
            .find(|(_, (full_link, _))| full_link.contains(media_fragment))
            .map(|(i, _)| i);

        match img_id_opt {
            Some(img_id) => {
                // mint
                // mint(&token.owner, img_id).await?;
                let owner = token
                    .owner
                    .parse::<ActorId>()
                    .expect("Error in parsing address");
                println!("address: {owner:?}");
                // let message_id = send_request!(api: &api, program_id: program_id, service_name: "Nft", action: "Mint", payload: (owner, Some(img_id as u64)));
                // assert!(listener.message_processed(message_id).await?.succeed());

                // metadata
                let token_id = token_id_str.parse::<u64>().unwrap_or(0);
                let metadata_vec = token.metadata_as_vec();
                if !metadata_vec.is_empty() {
                    // let message_id = send_request!(api: &api, program_id: program_id, service_name: "Nft", action: "ChangeMetadata", payload: (token_id, metadata_vec));
                    // assert!(listener.message_processed(message_id).await?.succeed());
                    // add_metadata(token_id, metadata_vec)?;
                }
            }
            None => {
                eprintln!(
                    "⚠️  Не найдено соответствие media fragment '{}' среди imgLinksAndData для token #{}",
                    media_fragment, token_id_str
                );
            }
        }
    }

    // let message_id = send_request!(api: &api, program_id: program_id, service_name: "Nft", action: "Mint", payload: ());
    // assert!(listener.message_processed(message_id).await?.succeed());

    Ok(())
}

fn sort_tokens(id_a: &str, a: &Token, id_b: &str, b: &Token) -> Ordering {
    let pa = id_a.parse::<u64>().unwrap_or(u64::MAX);
    let pb = id_b.parse::<u64>().unwrap_or(u64::MAX);
    match pa.cmp(&pb) {
        Ordering::Equal => {
            let ta = parse_mint_time(&a.mint_time).unwrap_or(u64::MAX);
            let tb = parse_mint_time(&b.mint_time).unwrap_or(u64::MAX);
            ta.cmp(&tb)
        }
        other => other,
    }
}

fn parse_mint_time(s: &str) -> Option<u64> {
    s.replace(',', "").parse::<u64>().ok()
}

async fn mint(owner: &str, img_id: usize) -> Result<()> {
    println!("mint(owner = {owner}, img_id = {img_id})");

    Ok(())
}

fn add_metadata(token_id: u64, metadata: Vec<String>) -> Result<()> {
    println!(
        "add_metadata(token_id = {token_id}, metadata = {:?})",
        metadata[0]
    );
    Ok(())
}

// --------------------- JSON structs ---------------------

#[derive(Deserialize)]
struct Root {
    #[serde(rename = "All")]
    all: All,
}

#[derive(Deserialize)]
struct All {
    // tokens: [ [ "id", { ...token... } ], ... ]
    tokens: Vec<(String, Token)>,

    #[serde(rename = "imgLinksAndData")]
    img_links_and_data: Vec<(String, ImageData)>,
}

#[derive(Deserialize)]
struct Token {
    owner: String,
    name: String,
    description: String,
    #[serde(default)]
    metadata: serde_json::Value,
    #[serde(rename = "mediaUrl")]
    media_url: String,
    #[serde(rename = "mintTime")]
    mint_time: String,
}

impl Token {
    pub fn metadata_as_vec(&self) -> Vec<String> {
        match &self.metadata {
            serde_json::Value::Array(arr) => arr
                .iter()
                .filter_map(|v| v.as_str().map(|s| s.to_string()))
                .collect(),
            _ => vec![],
        }
    }
}

#[derive(Deserialize)]
struct ImageData {
    #[serde(rename = "limitCopies")]
    limit_copies: Option<u32>,
}
