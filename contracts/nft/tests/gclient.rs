// use anyhow::Context;
// use gclient::{EventListener, EventProcessor, GearApi, Result};
// use sails_rs::{ActorId};
// use serde::Deserialize;
// use std::{cmp::Ordering, collections::HashMap, env, fs};
// use hex_literal::hex;
// use sails_rs::scale_codec::Encode;

// #[derive(Debug, Clone, Encode)]
// #[codec(crate = sails_rs::scale_codec)]
// pub struct ImageData {
//     pub limit_copies: Option<u32>,
//     pub name: Option<String>,
// }

// #[derive(Debug, Clone, Encode)]
// #[codec(crate = sails_rs::scale_codec)]
// pub struct Config {
//     pub name: String,
//     pub description: String,
//     pub collection_tags: Vec<String>,
//     pub collection_banner: String,
//     pub collection_logo: String,
//     pub user_mint_limit: Option<u32>,
//     pub additional_links: Option<AdditionalLinks>,
//     pub royalty: u16,
//     pub payment_for_mint: u128,
//     pub transferable: Option<u64>,
//     pub sellable: Option<u64>,
//     pub variable_meta: bool,
// }

// #[derive(Debug, Clone, Encode)]
// #[codec(crate = sails_rs::scale_codec)]
// pub struct AdditionalLinks {
//     pub external_url: Option<String>,
//     pub telegram: Option<String>,
//     pub xcom: Option<String>,
//     pub medium: Option<String>,
//     pub discord: Option<String>,
// }

// #[macro_export]
// macro_rules! send_request {
//     (api: $api:expr, program_id: $program_id:expr, service_name: $name:literal, action: $action:literal, payload: ($($val:expr),*)) => {
//         $crate::send_request!(api: $api, program_id: $program_id, service_name: $name, action: $action, payload: ($($val),*), value: 0)
//     };

//     (api: $api:expr, program_id: $program_id:expr, service_name: $name:literal, action: $action:literal, payload: ($($val:expr),*), value: $value:expr) => {
//         {
//             let request = [
//                 $name.encode(),
//                 $action.to_string().encode(),
//                 ($($val),*).encode(),
//             ].concat();

//             let (message_id, _) = $api
//                 .send_message_bytes($program_id, request.clone(), 749_000_000_000, $value)
//                 .await?;

//             message_id
//         }
//     };
// }

// #[tokio::test]
// async fn test_migration() -> Result<()> {
//     // let api = GearApi::dev().await?;

//     // let mut listener = api.subscribe().await?;
//     // assert!(listener.blocks_running().await?);
//     let img_links_and_data: Vec<(String, ImageData)> = vec![
//         ("ipfs://bafybeig7j7rlqhecoy4ueqk4asyhco6ivuda7zmkvtv7isnacjfpamlqku".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-1".to_string())}),
//         ("ipfs://bafybeifflrthw4t3vtucxuzogdvafqn72qloan2sdmv3fm2laaogeosfde".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-2".to_string())}),
//         ("ipfs://bafybeie7gtpwxpwbtcil26ucpetdiao77mffmv5y2fgvchrzlswymbsnbe".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-3".to_string())}),
//         ("ipfs://bafybeihie44agpr7j344v2yce7knkekiouiev3ezb57fktm3z7ly5i33vi".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-4".to_string())}),
//         ("ipfs://bafybeiah6s62jydnsakc6pvg4l3eipm2c7m3erplqiojdfkrgk6f4hqtku".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-5".to_string())}),
//         ("ipfs://bafybeia3bkboqqp622tdxyvmap5vfbm4ja7sy2pjzhkp2waitwc5k46cte".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-6".to_string())}),
//         ("ipfs://bafybeihrkczyti25ly5run4fema2y7u7w2zxqetxqne7nsfn5beqbx3p2a".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-7".to_string())}),
//         ("ipfs://bafybeienlvsp3hvdu3laldxjnqq2l3m4ty36rdk6cipnyg2qxfuawtsaii".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-8".to_string())}),
//         ("ipfs://bafybeihofltm65j4vgnzndavnalilifbz34bssdl3gcltzcaan2tyhcxjy".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-9".to_string())}),
//         ("ipfs://bafybeicyuhyx6a7d5ykfow3pavkdohh5clrdc6qbma6uxlp4z53iajslje".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-10".to_string())})
//         ];
//     const id: ActorId = ActorId::new(hex!(
//         "041071d04513c136396ca4e62eaf2c59d021a2720ba6be071a1a8363ec5f3d59"
//     ));

//     let payload = (
//         id,
//         Config{
//             name: "Vara Starship Fleet".to_string(),
//             description: "Vara Starship Fleet is a dynamic NFT collection representing upgradeable starships in the on-chain arcade game Vara Starship. Each ship evolves visually and functionally as the player progresses, from a basic vessel to an elite space fighter. NFTs reflect real in-game progress and adapt over time, combining gameplay achievements with unique digital ownership on the Vara Network. Mint your ship. Upgrade it. Own your fleet in the stars.".to_string(),
//             collection_tags: vec![],
//             collection_banner: "ipfs://bafybeighrirkevz4fefvw6zlninpgmhwjf6dmjgtew6ysy75cg56p5kyfa".to_string(),
//             collection_logo: "ipfs://bafybeifdl7jikl3dhr53wbo5efbbb4wmhzsvwh2hblms6huyipwbbj72ta".to_string(),
//             user_mint_limit: None::<u32>,
//             additional_links: None::<AdditionalLinks>,
//             royalty: 0,
//             payment_for_mint: 0,
//             // transferable: Some(0),
//             // sellable: Some(0),
//             transferable: None,
//             sellable: None,
//             variable_meta: true
//         },
//         img_links_and_data,
//         None::<Vec<ActorId>>,
//     );
//     // let request = [
//     //     "New".encode(),
//     //     payload.encode(),
//     // ].concat();
//     let request = ("New",  payload).encode();

//     println!("request {request:?}");

//     let img_links_and_data: Vec<(String, ImageData)> = vec![("link_1".to_string(), ImageData { limit_copies: None, name: None})];
//     // const id: ActorId = ActorId::new(hex!(
//     //     "041071d04513c136396ca4e62eaf2c59d021a2720ba6be071a1a8363ec5f3d59"
//     // ));

//     let payload = (
//         id,
//         Config{
//             name: "name".to_string(),
//             description: "description".to_string(),
//             collection_tags: vec![],
//             collection_banner: "collection_banner".to_string(),
//             collection_logo: "collection_logo".to_string(),
//             user_mint_limit: None::<u32>,
//             additional_links: None::<AdditionalLinks>,
//             royalty: 0,
//             payment_for_mint: 0,
//             transferable: None,
//             sellable: None,
//             variable_meta: false
//         },
//         img_links_and_data,
//         None::<Vec<ActorId>>,
//     );

//     let request = ("New",  payload).encode();
//     println!("request {request:?}");

//     let payload = [
//         12, 78, 101, 119, 250, 252, 203, 231, 107, 53, 184, 20, 179, 238, 91, 134, 204, 78, 28, 227, 211, 213, 145, 30, 94,
//         11, 119, 72, 152, 185, 83, 86, 164, 140, 15, 105, 16, 116, 101, 115, 116, 16, 116, 101, 115, 116, 0, 212, 105, 112,
//         102, 115, 58, 47, 47, 81, 109, 89, 57, 75, 53, 68, 71, 56, 66, 55, 120, 84, 103, 78, 115, 74, 89, 70, 65, 84, 53, 65,
//         99, 99, 99, 82, 74, 114, 52, 110, 52, 84, 114, 118, 88, 67, 88, 116, 98, 121, 111, 106, 110, 116, 57, 212, 105, 112,
//         102, 115, 58, 47, 47, 81, 109, 87, 81, 114, 86, 109, 88, 70, 55, 81, 118, 72, 105, 83, 97, 78, 102, 54, 78, 65, 82,
//         117, 54, 77, 51, 88, 54, 90, 53, 80, 67, 97, 51, 101, 99, 118, 100, 110, 115, 88, 54, 57, 84, 119, 72, 0, 1, 0, 1, 0,
//         1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 212, 105, 112, 102, 115, 58, 47,
//         47, 81, 109, 97, 70, 104, 71, 109, 104, 122, 78, 70, 111, 106, 49, 57, 70, 80, 80, 103, 100, 107, 88, 75, 104, 86, 82,
//         113, 70, 57, 55, 98, 115, 65, 53, 119, 51, 81, 50, 69, 53, 81, 98, 107, 99, 75, 111, 0, 0, 212, 105, 112, 102, 115,
//         58, 47, 47, 81, 109, 87, 56, 103, 99, 107, 68, 81, 50, 100, 83, 103, 75, 85, 98, 71, 81, 83, 56, 110, 119, 112, 83,
//         52, 65, 109, 116, 103, 84, 103, 68, 49, 120, 119, 71, 103, 80, 80, 83, 119, 112, 52, 110, 78, 98, 1, 1, 0, 0, 0, 0, 0,
//     ];

//     println!("payload {payload:?}");

// let path = "tests/migration-states/state-1.json";
// let json = fs::read_to_string(path).context(format!("cannot read {path}"))?;
// let root: Root = serde_json::from_str(&json).context("invalid json")?;

// let mut tokens = root.all.tokens;
// tokens.sort_by(|(id_a, a), (id_b, b)| sort_tokens(id_a, a, id_b, b));

// for (token_id_str, token) in tokens {
//     let media_fragment = token.media_url.as_str();

//     // Поиск первого индекса, где media_url входит в ссылку
//     let img_id_opt = root
//         .all
//         .img_links_and_data
//         .iter()
//         .enumerate()
//         .find(|(_, (full_link, _))| full_link.contains(media_fragment))
//         .map(|(i, _)| i);

//     match img_id_opt {
//         Some(img_id) => {
//             // mint
//             // mint(&token.owner, img_id).await?;
//             let owner = token
//                 .owner
//                 .parse::<ActorId>()
//                 .expect("Error in parsing address");
//             println!("address: {owner:?}");
//             // let message_id = send_request!(api: &api, program_id: program_id, service_name: "Nft", action: "Mint", payload: (owner, Some(img_id as u64)));
//             // assert!(listener.message_processed(message_id).await?.succeed());

//             // metadata
//             let token_id = token_id_str.parse::<u64>().unwrap_or(0);
//             let metadata_vec = token.metadata_as_vec();
//             if !metadata_vec.is_empty() {
//                 // let message_id = send_request!(api: &api, program_id: program_id, service_name: "Nft", action: "ChangeMetadata", payload: (token_id, metadata_vec));
//                 // assert!(listener.message_processed(message_id).await?.succeed());
//                 // add_metadata(token_id, metadata_vec)?;
//             }
//         }
//         None => {
//             eprintln!(
//                 "⚠️  Не найдено соответствие media fragment '{}' среди imgLinksAndData для token #{}",
//                 media_fragment, token_id_str
//             );
//         }
//     }
// }

// let message_id = send_request!(api: &api, program_id: program_id, service_name: "Nft", action: "Mint", payload: ());
// assert!(listener.message_processed(message_id).await?.succeed());

//     Ok(())
// }

// fn sort_tokens(id_a: &str, a: &Token, id_b: &str, b: &Token) -> Ordering {
//     let pa = id_a.parse::<u64>().unwrap_or(u64::MAX);
//     let pb = id_b.parse::<u64>().unwrap_or(u64::MAX);
//     match pa.cmp(&pb) {
//         Ordering::Equal => {
//             let ta = parse_mint_time(&a.mint_time).unwrap_or(u64::MAX);
//             let tb = parse_mint_time(&b.mint_time).unwrap_or(u64::MAX);
//             ta.cmp(&tb)
//         }
//         other => other,
//     }
// }

// fn parse_mint_time(s: &str) -> Option<u64> {
//     s.replace(',', "").parse::<u64>().ok()
// }

// async fn mint(owner: &str, img_id: usize) -> Result<()> {
//     println!("mint(owner = {owner}, img_id = {img_id})");

//     Ok(())
// }

// fn add_metadata(token_id: u64, metadata: Vec<String>) -> Result<()> {
//     println!(
//         "add_metadata(token_id = {token_id}, metadata = {:?})",
//         metadata[0]
//     );
//     Ok(())
// }

// // --------------------- JSON structs ---------------------

// #[derive(Deserialize)]
// struct Root {
//     #[serde(rename = "All")]
//     all: All,
// }

// #[derive(Deserialize)]
// struct All {
//     // tokens: [ [ "id", { ...token... } ], ... ]
//     tokens: Vec<(String, Token)>,

//     #[serde(rename = "imgLinksAndData")]
//     img_links_and_data: Vec<(String, ImageData)>,
// }

// #[derive(Deserialize)]
// struct Token {
//     owner: String,
//     name: String,
//     description: String,
//     #[serde(default)]
//     metadata: serde_json::Value,
//     #[serde(rename = "mediaUrl")]
//     media_url: String,
//     #[serde(rename = "mintTime")]
//     mint_time: String,
// }

// impl Token {
//     pub fn metadata_as_vec(&self) -> Vec<String> {
//         match &self.metadata {
//             serde_json::Value::Array(arr) => arr
//                 .iter()
//                 .filter_map(|v| v.as_str().map(|s| s.to_string()))
//                 .collect(),
//             _ => vec![],
//         }
//     }
// }

// #[derive(Deserialize)]
// struct ImageData {
//     #[serde(rename = "limitCopies")]
//     limit_copies: Option<u32>,
// }
