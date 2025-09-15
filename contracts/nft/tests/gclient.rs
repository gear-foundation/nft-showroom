use anyhow::Context;
use gclient::{EventListener, EventProcessor, GearApi, Result};
use hex_literal::hex;
use sails_rs::ActorId;
use sails_rs::Decode;
use sails_rs::scale_codec::Encode;
use serde::Deserialize;
use serde::de::{self, Deserializer};
use serde_json::Value;
use std::collections::{HashMap, HashSet};
use std::{cmp::Ordering, env, fs};

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

fn parse_u16_str(s: &str) -> u16 {
    s.parse::<u16>().unwrap_or(0)
}
fn parse_u32_opt_str(s: &Option<String>) -> Option<u32> {
    s.as_ref()?.parse::<u32>().ok()
}
fn parse_u64_opt_str(s: &Option<String>) -> Option<u64> {
    s.as_ref()?.parse::<u64>().ok()
}
fn parse_u128_str(s: &str) -> u128 {
    s.parse::<u128>().unwrap_or(0)
}

fn build_config(c: &JsonConfig) -> Config {
    Config {
        name: c.name.clone(),
        description: c.description.clone(),
        collection_tags: c.collection_tags.clone(),
        collection_banner: c.collection_banner.clone(),
        collection_logo: c.collection_logo.clone(),
        user_mint_limit: parse_u32_opt_str(&c.user_mint_limit),
        additional_links: c.additional_links.as_ref().map(|l| AdditionalLinks {
            external_url: l.external_url.clone(),
            telegram: l.telegram.clone(),
            xcom: l.xcom.clone(),
            medium: l.medium.clone(),
            discord: l.discord.clone(),
        }),
        royalty: parse_u16_str(&c.royalty),
        payment_for_mint: parse_u128_str(&c.payment_for_mint),
        transferable: parse_u64_opt_str(&c.transferable),
        sellable: parse_u64_opt_str(&c.sellable),
        // если нужно — вычисляйте из JSON; по умолчанию включаем переменную мету
        variable_meta: true,
    }
}

fn cid_from_url_strict(s: &str) -> String {
    let s = s.split('#').next().unwrap_or(s);
    let s = s.split('?').next().unwrap_or(s);
    if let Some(rest) = s.strip_prefix("ipfs://") {
        let rest = rest.strip_prefix("ipfs/").unwrap_or(rest);
        return rest
            .split('/')
            .next()
            .unwrap_or(rest)
            .trim()
            .trim_matches('/')
            .to_string();
    }
    if let Some(pos) = s.find("/ipfs/") {
        let rest = &s[pos + "/ipfs/".len()..];
        return rest
            .split('/')
            .next()
            .unwrap_or(rest)
            .trim()
            .trim_matches('/')
            .to_string();
    }
    s.trim().trim_matches('/').to_string()
}

fn parse_remaining_map(all: &All) -> (std::collections::HashMap<String, Option<u32>>, Vec<String>) {
    use std::collections::HashMap;
    let mut m = HashMap::new();
    let mut file_order = Vec::new();

    for (link, data) in &all.img_links_and_data {
        let cid = cid_from_url_strict(link);
        file_order.push(cid.clone());

        let rem = match data.limit_copies {
            LimitField::Missing => Some(0), // ключ отсутствует => трактуем как остаток 0
            LimitField::Unlimited => None,  // null => безлимит
            LimitField::Remaining(n) => Some(n), // число => остаток n
        };
        m.insert(cid, rem);
    }

    (m, file_order)
}

/// Формируем (link, ImageData) по **уникальным mediaUrl из tokens** (порядок по возрастанию token_id).
/// Стартовый лимит = minted_now + remaining_now; если безлимит — None; если записей нет — minted_now.
fn build_images_list(all: &All) -> Vec<(String, ImageData)> {
    use std::collections::{HashMap, HashSet};

    // 1) токены по возрастанию id
    let mut tokens_sorted = all.tokens.clone();
    tokens_sorted.sort_by_key(|(id, _)| id.parse::<u64>().unwrap_or(u64::MAX));

    let mut minted: HashMap<String, u32> = HashMap::new();
    let mut token_order: Vec<String> = Vec::new();
    let mut seen_tokens: HashSet<String> = HashSet::new();

    for (_id, t) in &tokens_sorted {
        let cid = cid_from_url_strict(&t.media_url);
        *minted.entry(cid.clone()).or_default() += 1;
        if seen_tokens.insert(cid.clone()) {
            token_order.push(cid);
        }
    }

    // 2) остаток сейчас + порядок из файла
    let (remaining_map, file_order) = parse_remaining_map(all);

    // 3) собираем итог: сначала токены, затем "остаточные" из файла
    let mut out = Vec::new();
    let mut seen_out: HashSet<String> = HashSet::new();

    // helper: посчитать стартовый лимит для cid
    let mut push_entry = |cid: &str| {
        if !seen_out.insert(cid.to_string()) {
            return;
        }
        let minted_now = minted.get(cid).copied().unwrap_or(0);
        let limit_copies = match remaining_map.get(cid) {
            Some(None) => None, // безлимит (null), в приоритете — не суммируем
            Some(Some(r)) => {
                let total = (minted_now as u64) + (*r as u64);
                Some(total.min(u32::MAX as u64) as u32)
            }
            None => Some(minted_now), // нет записи => всё сминтили
        };
        out.push((
            format!("ipfs://{}", cid),
            ImageData {
                limit_copies,
                name: None,
            },
        ));
    };

    // 3.1 сначала все CID из токенов
    for cid in &token_order {
        push_entry(cid);
    }

    // 3.2 затем CID из файла, которых не было среди токенов (это как раз твои 29)
    for cid in &file_order {
        if !seen_tokens.contains(cid) {
            push_entry(cid);
        }
    }

    out
}

#[tokio::test]
async fn test_migration() -> Result<()> {
    let api = GearApi::init_with(
        gclient::WSAddress::new("wss://testnet.vara.network", Some(443)),
        "//Alice",
    )
    .await?;

    println!("Connected to the node\n");

    let mut listener = api.subscribe().await?;
    assert!(listener.blocks_running().await?);

    println!("Network is live\n");

    let mut files: Vec<_> = std::fs::read_dir("tests/migration-states")?
        .filter_map(|e| e.ok())
        .map(|e| e.path())
        .filter(|p| p.extension().map(|e| e == "json").unwrap_or(false))
        .collect();

    files.sort_by_key(|p| {
        p.file_name()
            .and_then(|n| n.to_str())
            .and_then(|s| {
                s.trim_start_matches("state-")
                    .trim_end_matches(".json")
                    .parse::<u64>()
                    .ok()
            })
            .unwrap_or(u64::MAX)
    });

    for path in files {
        let json = fs::read_to_string(&path).with_context(|| format!("cannot read {:?}", path))?;
        let root: Root = serde_json::from_str(&json).context("invalid json")?;

        // marketplace / admin / perms
        let marketplace_id = ActorId::new(hex!(
            "301564c4d456f8287e67c87821b7d6422ec1d0d0d77bd96d4285278349da1e38"
        ));
        let admin_id = ActorId::new(hex!(
            "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"
        ));
        let perms: Option<Vec<ActorId>> = Some(vec![ActorId::new(hex!(
            "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"
        ))]);

        // payload для создания
        let cfg = build_config(&root.all.config);
        let images = build_images_list(&root.all);

        let payload = (admin_id, cfg, images.clone(), perms);
        println!("payload: {payload:?}\n");
        let payload = ("New", payload).encode();
        let request = [
            "NftShowroom".encode(),
            "CreateCollection".to_string().encode(),
            ("Simple NFT Collection".to_string(), payload).encode(),
        ]
        .concat();

        let price = images.len() * 282_857_142_900;

        let value = if price > 1_000_000_000_000 {
            price + 1_000_000_000_000
        } else {
            2_000_000_000_000
        };

        let (message_id, _) = api
            .send_message_bytes(marketplace_id, request, 749_000_000_000, value as u128)
            .await?;

        let (_, raw_reply, _) = listener
            .reply_bytes_on(message_id)
            .await
            .expect("Error listen reply");

        // Ожидаем кортеж (service, action, value). Подредактируйте под ваш формат.
        let decoded =
            <(String, String, CreateCollectionReply)>::decode(&mut raw_reply.unwrap().as_slice())
                .expect("Error decode reply");

        let new_collection_id = decoded.2.collection_address;

        println!(
            "✔ Created collection: {new_collection_id:?} from {:?}",
            path.file_name().unwrap()
        );

        // ---- МИГРАЦИЯ ТОКЕНОВ ----
        migrate_tokens(
            &api,
            &mut listener,
            new_collection_id,
            &root,
            &images,
            admin_id,
        )
        .await?;
        println!("✔ Migrated tokens for {:?}", path.file_name().unwrap());

        apply_post_creation_roles(&api, &mut listener, new_collection_id, &root.all).await?;
        println!("✔ apply_post_creation_roles");

        let mid = send_request!(
            api: api,
            program_id: new_collection_id,
            service_name: "Nft",
            action: "DeleteUserForMint",
            payload: (admin_id)
        );
        assert!(listener.message_processed(mid).await?.succeed());
        println!("✔ Delete User For Mint Alice address");
        let mid = send_request!(
            api: api,
            program_id: new_collection_id,
            service_name: "Nft",
            action: "RemoveAdmin",
            payload: (admin_id)
        );
        assert!(listener.message_processed(mid).await?.succeed());
        println!("✔ Remove Admin Alice address");
    }
    Ok(())
}

/// Минтит токены строго по возрастанию token_id.
/// `images_created` — именно тот список, который вы отправили при создании коллекции (link, ImageData { limit_copies, name: None }).
/// Локально поддерживаем текущие остатки и динамически находим индекс по CID перед каждым минтом.
async fn migrate_tokens(
    api: &GearApi,
    listener: &mut EventListener,
    collection_id: ActorId,
    root: &Root,
    images_created: &[(String, ImageData)],
    admin_id: ActorId,
) -> Result<()> {
    #[derive(Clone, Debug)]
    struct RuntimeImage {
        cid: String,
        remaining: Option<u32>, // None = безлимит, Some(N) = N осталось прямо сейчас
    }

    // 1) runtime: текущее состояние массива изображений в коллекции (индексы будут сдвигаться при удалении)
    let mut runtime: Vec<RuntimeImage> = images_created
        .iter()
        .map(|(link, data)| RuntimeImage {
            cid: cid_from_url_strict(link),
            remaining: data.limit_copies,
        })
        .collect();

    // 2) токены по возрастанию id
    let mut tokens_sorted = root.all.tokens.clone();
    tokens_sorted.sort_by_key(|(id, _)| id.parse::<u64>().unwrap_or(u64::MAX));

    // 3) миграция по порядку id
    for (token_id_str, token) in tokens_sorted {
        let token_id = match token_id_str.parse::<u64>() {
            Ok(v) => v,
            Err(_) => {
                eprintln!("⚠️ token_id '{}' не u64 — пропущено", token_id_str);
                continue;
            }
        };
        let owner = match token.owner.parse::<ActorId>() {
            Ok(a) => a,
            Err(_) => {
                eprintln!("⚠️ owner '{}' не ActorId — пропущено", token.owner);
                continue;
            }
        };

        let cid = cid_from_url_strict(&token.media_url);

        // 3.1 найти ТЕКУЩИЙ индекс по CID (с учётом всех предыдущих удалений)
        let idx = match runtime.iter().position(|r| r.cid == cid) {
            Some(i) => i,
            None => {
                // Это возможно, если стартовый лимит по этому CID был рассчитан неверно (меньше, чем фактически нужно),
                // и запись была удалена раньше времени. Сообщаем и пропускаем, чтобы не «вылететь».
                eprintln!(
                    "⚠️ CID '{}' отсутствует в runtime (возможно, исчерпался и был удалён) — пропущено",
                    cid
                );
                continue;
            }
        };

        // 3.2 Минт по текущему индексу
        let mid = send_request!(
            api: api,
            program_id: collection_id,
            service_name: "Nft",
            action: "Mint",
            payload: (owner, Some(idx as u64))
        );
        if !listener.message_processed(mid).await?.succeed() {
            let mid = send_request!(
                api: api,
                program_id: collection_id,
                service_name: "Nft",
                action: "Mint",
                payload: (admin_id, Some(idx as u64))
            );
            assert!(listener.message_processed(mid).await?.succeed());
            let mid = send_request!(
                api: api,
                program_id: collection_id,
                service_name: "Nft",
                action: "TransferFrom",
                payload: (admin_id, owner, token_id)
            );
            assert!(listener.message_processed(mid).await?.succeed());
        }

        // 3.3 Метаданные (если есть)
        let metadata_vec = token.metadata_as_vec();
        if !metadata_vec.is_empty() {
            let mid = send_request!(
                api: api,
                program_id: collection_id,
                service_name: "Nft",
                action: "ChangeMetadata",
                payload: (token_id, metadata_vec)
            );
            assert!(listener.message_processed(mid).await?.succeed());
        }

        // 3.4 Обновить локальный остаток и, если стал 0, удалить запись, «сдвинув» индексы
        if let Some(rem) = runtime[idx].remaining {
            if rem <= 1 {
                // этот минт забрал последнюю копию — запись пропадает, индексы справа сдвинутся влево
                runtime.remove(idx);
            } else {
                runtime[idx].remaining = Some(rem - 1);
            }
        }
        // Если None (безлимит) — ничего не меняем.
    }

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

fn parse_actor_hex(s: &str) -> anyhow::Result<ActorId> {
    use sails_rs::hex;
    let bytes = hex::decode(s.trim_start_matches("0x"))
        .with_context(|| format!("bad hex ActorId: {}", s))?;

    // Требуем ровно 32 байта
    let arr: [u8; 32] = bytes.try_into().unwrap();

    Ok(ActorId::new(arr))
}

// ------------ выдать роли и права после минта --------------
async fn apply_post_creation_roles(
    api: &GearApi,
    listener: &mut EventListener,
    collection_id: ActorId,
    all: &All,
) -> Result<()> {
    let id = ActorId::new(hex!(
        "041071d04513c136396ca4e62eaf2c59d021a2720ba6be071a1a8363ec5f3d59"
    ));
    let mid = send_request!(
        api: api,
        program_id: collection_id,
        service_name: "Nft",
        action: "AddAdmin",
        payload: (id)
    );
    assert!(listener.message_processed(mid).await?.succeed());
    // 1) Добавить админов
    if let Some(admins) = &all.admins {
        let mut seen = HashSet::new();
        for a in admins {
            if seen.insert(a.as_str()) {
                let admin = match parse_actor_hex(a) {
                    Ok(x) => x,
                    Err(e) => {
                        eprintln!("⚠️ skip admin '{}': {}", a, e);
                        continue;
                    }
                };
                let mid = send_request!(
                    api: api,
                    program_id: collection_id,
                    service_name: "Nft",
                    action: "AddAdmin",
                    payload: (admin)
                );
                assert!(listener.message_processed(mid).await?.succeed());
            }
        }
    }

    // 2) Добавить permissionToMint
    if let Some(perms) = &all.permission_to_mint {
        let mut seen = HashSet::new();
        let mut addrs: Vec<ActorId> = Vec::new();

        for p in perms {
            if !seen.insert(p.as_str()) {
                continue;
            }
            match parse_actor_hex(p) {
                Ok(x) => addrs.push(x),
                Err(e) => eprintln!("⚠️ skip perm '{}': {}", p, e),
            }
        }

        addrs.push(id);

        if !addrs.is_empty() {
            let mid = send_request!(
                api: api,
                program_id: collection_id,
                service_name: "Nft",
                action: "AddUsersForMint",
                payload: (addrs)
            );
            assert!(listener.message_processed(mid).await?.succeed());
        }
    }

    Ok(())
}
// ---------------- JSON-модели ----------------

#[derive(Deserialize, Clone)]
struct Root {
    #[serde(rename = "All")]
    all: All,
}

#[derive(Deserialize, Clone)]
struct All {
    tokens: Vec<(String, Token)>,
    owners: Vec<(String, Vec<String>)>,
    #[serde(rename = "tokenApprovals")]
    token_approvals: Vec<serde_json::Value>,
    config: JsonConfig,
    #[serde(rename = "nonce")]
    _nonce: Option<String>,
    #[serde(rename = "imgLinksAndData")]
    img_links_and_data: Vec<(String, ImageDataJson)>,
    #[serde(rename = "collectionOwner")]
    collection_owner: String,
    #[serde(rename = "totalNumberOfTokens")]
    _total: Option<String>,
    #[serde(rename = "permissionToMint")]
    permission_to_mint: Option<Vec<String>>,
    #[serde(rename = "marketplaceAddress")]
    marketplace_address: String,
    admins: Option<Vec<String>>,
}

#[derive(Deserialize, Clone)]
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

#[derive(Clone, Debug, PartialEq, Eq)]
enum LimitField {
    Missing,        // ключ отсутствует
    Unlimited,      // null
    Remaining(u32), // число или строка с числом
}
impl Default for LimitField {
    fn default() -> Self {
        LimitField::Missing
    }
}

// --- 2) JSON-модель с кастомным парсером ---
#[derive(Deserialize, Clone)]
struct ImageDataJson {
    // Важно: поле НЕ Option. Отличаем missing через Default.
    #[serde(rename = "limitCopies", deserialize_with = "de_limit_copies", default)]
    limit_copies: LimitField,
}

fn de_limit_copies<'de, D>(d: D) -> Result<LimitField, D::Error>
where
    D: Deserializer<'de>,
{
    // Парсим именно Value: null дойдёт как Value::Null,
    // а если ключ отсутствует — сюда вообще не зайдём (сработает Default::default()).
    let v: Value = Value::deserialize(d)?;
    match v {
        Value::Null => Ok(LimitField::Unlimited),
        Value::Number(n) => {
            let u = n
                .as_u64()
                .ok_or_else(|| de::Error::custom("limitCopies not unsigned"))?;
            Ok(LimitField::Remaining(u.min(u32::MAX as u64) as u32))
        }
        Value::String(s) => {
            let u = s
                .parse::<u64>()
                .map_err(|_| de::Error::custom("limitCopies string not u64"))?;
            Ok(LimitField::Remaining(u.min(u32::MAX as u64) as u32))
        }
        _ => Err(de::Error::custom("limitCopies must be null/number/string")),
    }
}

#[derive(Debug, Clone, Encode)]
#[codec(crate = sails_rs::scale_codec)]
struct ImageData {
    pub limit_copies: Option<u32>,
    pub name: Option<String>, // при создании всегда None
}

#[derive(Deserialize, Clone)]
struct JsonConfig {
    name: String,
    description: String,
    #[serde(rename = "collectionTags")]
    collection_tags: Vec<String>,
    #[serde(rename = "collectionBanner")]
    collection_banner: String,
    #[serde(rename = "collectionLogo")]
    collection_logo: String,
    #[serde(rename = "userMintLimit")]
    user_mint_limit: Option<String>,
    #[serde(rename = "additionalLinks")]
    additional_links: Option<JsonAdditionalLinks>,
    royalty: String,
    #[serde(rename = "paymentForMint")]
    payment_for_mint: String,
    /// строки "0"/"1" (или другие числа)
    transferable: Option<String>,
    sellable: Option<String>,
}

#[derive(Deserialize, Clone)]
struct JsonAdditionalLinks {
    #[serde(rename = "externalUrl")]
    external_url: Option<String>,
    telegram: Option<String>,
    xcom: Option<String>,
    medium: Option<String>,
    discord: Option<String>,
}

// ---------------- SCALE-типы payload ----------------

#[derive(Debug, Clone, Encode)]
#[codec(crate = sails_rs::scale_codec)]
struct Config {
    name: String,
    description: String,
    collection_tags: Vec<String>,
    collection_banner: String,
    collection_logo: String,
    user_mint_limit: Option<u32>,
    additional_links: Option<AdditionalLinks>,
    royalty: u16,
    payment_for_mint: u128,
    transferable: Option<u64>,
    sellable: Option<u64>,
    variable_meta: bool,
}

#[derive(Debug, Clone, Encode)]
#[codec(crate = sails_rs::scale_codec)]
struct AdditionalLinks {
    external_url: Option<String>,
    telegram: Option<String>,
    xcom: Option<String>,
    medium: Option<String>,
    discord: Option<String>,
}

#[derive(Debug, Clone, Encode)]
#[codec(crate = sails_rs::scale_codec)]
struct ImageDataCreate {
    limit_copies: Option<u32>,
}

#[derive(Debug, Clone, Encode, Decode)]
#[codec(crate = sails_rs::scale_codec)]
struct CreateCollectionReply {
    type_name: String,
    collection_address: ActorId,
}

fn canonical_ipfs_link(cid: &str) -> String {
    format!("ipfs://{}", cid)
}

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

// #[tokio::test]
// async fn get_payload() -> Result<()> {
//     // let img_links_and_data: Vec<(String, ImageData)> = vec![
//     //     ("ipfs://bafybeig7j7rlqhecoy4ueqk4asyhco6ivuda7zmkvtv7isnacjfpamlqku".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-1".to_string())}),
//     //     ("ipfs://bafybeifflrthw4t3vtucxuzogdvafqn72qloan2sdmv3fm2laaogeosfde".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-2".to_string())}),
//     //     ("ipfs://bafybeie7gtpwxpwbtcil26ucpetdiao77mffmv5y2fgvchrzlswymbsnbe".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-3".to_string())}),
//     //     ("ipfs://bafybeihie44agpr7j344v2yce7knkekiouiev3ezb57fktm3z7ly5i33vi".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-4".to_string())}),
//     //     ("ipfs://bafybeiah6s62jydnsakc6pvg4l3eipm2c7m3erplqiojdfkrgk6f4hqtku".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-5".to_string())}),
//     //     ("ipfs://bafybeia3bkboqqp622tdxyvmap5vfbm4ja7sy2pjzhkp2waitwc5k46cte".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-6".to_string())}),
//     //     ("ipfs://bafybeihrkczyti25ly5run4fema2y7u7w2zxqetxqne7nsfn5beqbx3p2a".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-7".to_string())}),
//     //     ("ipfs://bafybeienlvsp3hvdu3laldxjnqq2l3m4ty36rdk6cipnyg2qxfuawtsaii".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-8".to_string())}),
//     //     ("ipfs://bafybeihofltm65j4vgnzndavnalilifbz34bssdl3gcltzcaan2tyhcxjy".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-9".to_string())}),
//     //     ("ipfs://bafybeicyuhyx6a7d5ykfow3pavkdohh5clrdc6qbma6uxlp4z53iajslje".to_string(), ImageData { limit_copies: None, name: Some("StarShip lvl-10".to_string())})
//     //     ];
//     // const id: ActorId = ActorId::new(hex!(
//     //     "041071d04513c136396ca4e62eaf2c59d021a2720ba6be071a1a8363ec5f3d59"
//     // ));

//     // let payload = (
//     //     id,
//     //     Config{
//     //         name: "Vara Starship Fleet".to_string(),
//     //         description: "Vara Starship Fleet is a dynamic NFT collection representing upgradeable starships in the on-chain arcade game Vara Starship. Each ship evolves visually and functionally as the player progresses, from a basic vessel to an elite space fighter. NFTs reflect real in-game progress and adapt over time, combining gameplay achievements with unique digital ownership on the Vara Network. Mint your ship. Upgrade it. Own your fleet in the stars.".to_string(),
//     //         collection_tags: vec![],
//     //         collection_banner: "ipfs://bafybeighrirkevz4fefvw6zlninpgmhwjf6dmjgtew6ysy75cg56p5kyfa".to_string(),
//     //         collection_logo: "ipfs://bafybeifdl7jikl3dhr53wbo5efbbb4wmhzsvwh2hblms6huyipwbbj72ta".to_string(),
//     //         user_mint_limit: None::<u32>,
//     //         additional_links: None::<AdditionalLinks>,
//     //         royalty: 0,
//     //         payment_for_mint: 0,
//     //         // transferable: Some(0),
//     //         // sellable: Some(0),
//     //         transferable: None,
//     //         sellable: None,
//     //         variable_meta: true
//     //     },
//     //     img_links_and_data,
//     //     None::<Vec<ActorId>>,
//     // );
//     // // let request = [
//     // //     "New".encode(),
//     // //     payload.encode(),
//     // // ].concat();
//     // let request = ("New",  payload).encode();

//     // println!("request {request:?}");

//     // let img_links_and_data: Vec<(String, ImageData)> = vec![("link_1".to_string(), ImageData { limit_copies: None, name: None})];
//     // // const id: ActorId = ActorId::new(hex!(
//     // //     "041071d04513c136396ca4e62eaf2c59d021a2720ba6be071a1a8363ec5f3d59"
//     // // ));

//     // let payload = (
//     //     id,
//     //     Config{
//     //         name: "name".to_string(),
//     //         description: "description".to_string(),
//     //         collection_tags: vec![],
//     //         collection_banner: "collection_banner".to_string(),
//     //         collection_logo: "collection_logo".to_string(),
//     //         user_mint_limit: None::<u32>,
//     //         additional_links: None::<AdditionalLinks>,
//     //         royalty: 0,
//     //         payment_for_mint: 0,
//     //         transferable: Some(0),
//     //         sellable: Some(0),
//     //         variable_meta: true
//     //     },
//     //     img_links_and_data,
//     //     None::<Vec<ActorId>>,
//     // );

//     // let request = ("New",  payload).encode();
//     // println!("request {request:?}");

//     let img_links_and_data: Vec<(String, ImageData)> = vec![
//         ("ipfs://QmNqJhRVqrNNKrEsnyMkyQ5y1C5TKjGDKjZnaAA66qG9q1".to_string(), ImageData { limit_copies: None, name: None}),
//         ("ipfs://QmawCPCLKuM8rhZbHetEm9vhfZvzq4qEhpSwi3sBrn9BhZ".to_string(), ImageData { limit_copies: None, name: None}),
//         ("ipfs://QmSat6bPfgW4V6xt6VSuKYMQzV4xtQ549WKoJFzsxdYCmn".to_string(), ImageData { limit_copies: None, name: None}),
//         ("ipfs://QmSfionQmn9ojLNYzWk31yxyUVDhn1krKjh44rd1Affw1g".to_string(), ImageData { limit_copies: None, name: None}),
//         ];
//     const id: ActorId = ActorId::new(hex!(
//         "041071d04513c136396ca4e62eaf2c59d021a2720ba6be071a1a8363ec5f3d59"
//     ));
//     let permission_to_mint_id: ActorId = ActorId::new(hex!(
//         "ee20998f8b9fcf6c1366f8de1b5f30c08c7bbc2b61ca96a13768dffc07db9b64"
//     ));

//     let payload = (
//         id,
//         Config{
//             name: "Vara Ambassador Signature Series".to_string(),
//             description: "The Vara Ambassador Signature Series is an exclusive series of NFTs that celebrate the dedication, leadership, and contributions of the Vara Network Ambassadors. Each NFT in this collection represents a different level within the program, reflecting the strength of Vara ambassadors.\n\nFrom the swift Cheetah Apprentices to the commanding Lion Leaders. As you advance through the levels—Apprentice, Ambassador, Senior Ambassador, and Lead Ambassador—you earn these exclusive NFTs, each embodying the spirit and commitment of the Vara Ambassadors.\n\nThese dynamic NFTs evolve with your progress, showcasing real-time achievements and milestones within the Vara Ambassador Program.\n\nSelect your favorite NFT from the eligible level's collection and showcase your unique journey within the Vara ecosystem, where your contributions are recognized and celebrated with these beautiful and unique digital collectibles.".to_string(),
//             collection_tags: vec![],
//             collection_banner: "ipfs://QmNuiyehDarwtpSyvufEpsz9WSsmMv6kJyKaVYdm67Z5J8".to_string(),
//             collection_logo: "ipfs://QmWJrYnUkkFkbVFoTFNR9Lg7ivdFgGh18MjKTmp7oZkGEQ".to_string(),
//             user_mint_limit: Some(1 as u32),
//             additional_links: Some(AdditionalLinks {
//                 external_url: Some("https://vara.network/".to_string()),
//                 telegram: Some("https://t.me/VaraNetwork_Global".to_string()),
//                 xcom: Some("https://twitter.com/VaraNetwork".to_string()),
//                 medium: Some("https://medium.com/@VaraNetwork".to_string()),
//                 discord: Some("https://discord.gg/x8ZeSy6S6K".to_string()),
//             }),
//             royalty: 0,
//             payment_for_mint: 0,
//             // transferable: Some(0),
//             // sellable: Some(0),
//             transferable: None,
//             sellable: None,
//             variable_meta: true
//         },
//         img_links_and_data,
//         Some(vec![permission_to_mint_id]),
//     );
//     // let request = [
//     //     "New".encode(),
//     //     payload.encode(),
//     // ].concat();
//     let request = ("New",  payload).encode();

//     println!("request {request:?}");

//     Ok(())
// }
