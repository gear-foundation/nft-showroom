#![no_std]

use sails_rs::collections::{HashMap, HashSet};
use sails_rs::gstd::{exec, msg};
use sails_rs::prelude::*;

mod utils;
use utils::*;

#[derive(Debug)]
struct Storage {
    pub tokens: HashMap<NftId, NftData>,
    pub owners: HashMap<ActorId, HashSet<NftId>>,
    pub restriction_mint: HashMap<ActorId, u32>, // made in order to track the number of mint!(not transfer) nft
    pub token_approvals: HashMap<NftId, ActorId>,
    pub config: Config,
    pub nonce: NftId,
    pub img_links_and_data: Vec<(String, ImageData)>,
    pub collection_owner: ActorId,
    pub permission_to_mint: Option<Vec<ActorId>>,
    pub total_number_of_tokens: Option<u64>,
    pub marketplace_address: ActorId,
    pub admins: HashSet<ActorId>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum Event {
    Transferred {
        owner: ActorId,
        recipient: ActorId,
        token_id: NftId,
    },
    Minted {
        token_id: NftId,
        nft_data: NftData,
    },
    Initialized {
        config: Config,
        total_number_of_tokens: Option<u64>,
        permission_to_mint: Option<Vec<ActorId>>,
    },
    Approved {
        to: ActorId,
        token_id: NftId,
    },
    ApprovalRevoked {
        token_id: NftId,
    },
    Expanded {
        additional_links: Vec<(String, ImageData)>,
        total_number_of_tokens: Option<u64>,
    },
    ConfigChanged {
        config: Config,
    },
    UsersForMintAdded {
        users: Vec<ActorId>,
    },
    UserForMintDeleted {
        user: ActorId,
    },
    LiftRestrictionMint,
    AdminAdded {
        admin: ActorId,
    },
    AdminRemoved {
        admin: ActorId,
    },
    MetadataAdded {
        nft_id: u64,
        metadata: String,
    },
    ImageLinkChanged {
        nft_id: u64,
        img_link: String,
    },
    MetadataChanged {
        nft_id: u64,
        metadata: Vec<String>,
    },
    MetadataDeleted {
        nft_id: u64,
    },
}

static mut STORAGE: Option<Storage> = None;

#[allow(static_mut_refs)]
impl NftService {
    pub fn init(
        collection_owner: ActorId,
        config: Config,
        img_links_and_data: Vec<(String, ImageData)>,
        mut permission_to_mint: Option<Vec<ActorId>>,
    ) -> Self {
        let msg_value = msg::value();
        let picture_fee = FEE_PER_UPLOADED_FILE * img_links_and_data.len() as u128;

        let existential_deposit = exec::env_vars().existential_deposit;
        if picture_fee < existential_deposit && msg_value != existential_deposit
            || picture_fee >= existential_deposit && msg_value != picture_fee
        {
            panic("Wrong value for picture fee");
        }

        if config
            .user_mint_limit
            .map(|limit| limit == 0)
            .unwrap_or(false)
        {
            panic!("The mint limit must be greater than zero");
        }

        if config.payment_for_mint > 0 && config.payment_for_mint < existential_deposit {
            panic(
                "The payment for mint must be greater than existential deposit ({existential_deposit:?})",
            );
        }

        // can't take more than MAX_CREATOR_ROYALTY
        if config.royalty > MAX_CREATOR_ROYALTY {
            panic("Royalty percent must be less");
        }

        // can't be made sellable but not transferable.
        if config.transferable.is_none() && config.sellable.is_some() {
            panic("Tokens must be transferable");
        }
        // at least one image in the collection is a must have.
        if img_links_and_data.is_empty() {
            panic!("There must be at least one link to create a collection");
        }

        // сan't have zero copies of the nft.
        if img_links_and_data
            .iter()
            .any(|(_, img_data)| img_data.limit_copies == Some(0))
        {
            panic("Limit of copies value is equal to 0");
        }

        let total_number_of_tokens = sum_limit_copies(&img_links_and_data);
        if let Some(users) = permission_to_mint.as_mut() {
            if !users.contains(&collection_owner) {
                users.push(collection_owner);
            }
        }

        let mut admins = HashSet::new();
        admins.insert(collection_owner);
        unsafe {
            STORAGE = Some(Storage {
                tokens: HashMap::new(),
                owners: HashMap::new(),
                token_approvals: HashMap::new(),
                restriction_mint: HashMap::new(),
                config: config.clone(),
                nonce: 0,
                img_links_and_data,
                collection_owner,
                total_number_of_tokens,
                permission_to_mint: permission_to_mint.clone(),
                marketplace_address: msg::source(),
                admins,
            })
        };
        msg::send(
            collection_owner,
            Event::Initialized {
                config: config.clone(),
                total_number_of_tokens,
                permission_to_mint: permission_to_mint.clone(),
            },
            0,
        )
        .expect("Error during send to owner `Event::Initialized`");

        msg::send_with_gas(
            0.into(),
            Event::Initialized {
                config,
                total_number_of_tokens,
                permission_to_mint,
            },
            0,
            msg_value,
        )
        .expect("Error during send reply `Event::Initialized`");

        Self(())
    }
    fn get_mut(&mut self) -> &'static mut Storage {
        unsafe { STORAGE.as_mut().expect("Storage is not initialized") }
    }
    fn get(&self) -> &'static Storage {
        unsafe { STORAGE.as_ref().expect("Storage is not initialized") }
    }
}

struct NftService(());

#[sails_rs::service(events = Event)]
impl NftService {
    pub fn new() -> Self {
        Self(())
    }

    pub fn mint(&mut self, minter: ActorId, img_link_id: Option<u64>) {
        let storage = self.get_mut();
        let msg_source = msg::source();
        let msg_value = msg::value();

        // check if there are tokens for mint
        check_available_amount_of_tokens(storage);

        // check if a user can make a mint:
        // - quantity limit
        // - user-specific limit
        check_mint(&msg_source, &minter, storage);
        // value check on mint
        payment_for_mint(msg_value, storage);
        
        let Some(next_nft_nonce) = storage.nonce.checked_add(1) else {
            panic("Math overflow");
        };
        let image_id = if let Some(id) = img_link_id {
            id
        } else {
            get_random_value(storage.img_links_and_data.len() as u64)
        };

        let token_id = storage.nonce;

        let (link, img_info) = storage
            .img_links_and_data
            .get_mut(image_id as usize)
            .expect("Error getting random");

        if let Some(limit) = img_info.limit_copies.as_mut() {
            *limit -= 1;
        }

        let img_link = link.clone();

        // if there are 0 copies of this token left, then delete this token
        if let Some(0) = img_info.limit_copies {
            storage.img_links_and_data.remove(image_id as usize);
        }

        storage
            .owners
            .entry(minter)
            .and_modify(|ids| {
                ids.insert(token_id);
            })
            .or_insert_with(|| HashSet::from([token_id]));

        let name = format!("{} - {}", storage.config.name, token_id);
        let nft_data = NftData {
            owner: minter,
            name,
            description: storage.config.description.clone(),
            metadata: vec![],
            media_url: img_link.clone(),
            mint_time: exec::block_timestamp(),
        };
        storage.nonce = next_nft_nonce;
        storage.tokens.insert(token_id, nft_data.clone());
        storage
            .restriction_mint
            .entry(minter)
            .and_modify(|ids| {
                *ids += 1;
            })
            .or_insert(1);

        self.emit_event(Event::Minted { token_id, nft_data })
            .expect("Event Invocation Error");
    }

    pub fn transfer_from(&mut self, from: ActorId, to: ActorId, token_id: NftId) {
        let storage = self.get_mut();
        // checking for the possibility to transfer
        can_transfer(&from, &to, &token_id, storage);

        let nft = storage
            .tokens
            .get_mut(&token_id)
            .expect("Token does not exist");

        let tokens = storage
            .owners
            .get_mut(&from)
            .expect("Owner does not have nft");

        tokens.retain(|&token| token != token_id);

        if tokens.is_empty() {
            storage.owners.remove(&from);
        }

        nft.owner = to;

        storage
            .owners
            .entry(to)
            .and_modify(|ids| {
                ids.insert(token_id);
            })
            .or_insert_with(|| HashSet::from([token_id]));

        storage.token_approvals.remove(&token_id);

        self.emit_event(Event::Transferred {
            owner: from,
            recipient: to,
            token_id,
        })
        .expect("Event Invocation Error");
    }

    pub fn approve(&mut self, to: ActorId, token_id: NftId) {
        let storage = self.get_mut();
        // checking for the possibility to give an approve
        can_approve(&token_id, storage);
        storage.token_approvals.insert(token_id, to);
        self.emit_event(Event::Approved { to, token_id })
            .expect("Event Invocation Error");
    }

    pub fn revoke_approve(&mut self, token_id: NftId) {
        let storage = self.get_mut();
        let nft_info = storage.tokens.get(&token_id).expect("Token does not exist");

        if nft_info.owner != msg::source() {
            panic("Access denied");
        }
        storage
            .token_approvals
            .remove(&token_id)
            .expect("No approval");

        self.emit_event(Event::ApprovalRevoked { token_id })
            .expect("Event Invocation Error");
    }

    pub fn expand(&mut self, additional_links: Vec<(String, ImageData)>) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(msg_src, storage);
        if additional_links
            .iter()
            .any(|(_, img_data)| img_data.limit_copies == Some(0))
        {
            panic("Limit is zero");
        }

        storage.img_links_and_data.extend(additional_links.clone());
        let mut number_tokens = sum_limit_copies(&storage.img_links_and_data);
        // The tokens that have already been minted should be added as well
        if let Some(all_copies) = number_tokens.as_mut() {
            *all_copies += storage.tokens.len() as u64;
        }
        storage.total_number_of_tokens = number_tokens;

        self.emit_event(Event::Expanded {
            additional_links,
            total_number_of_tokens: number_tokens,
        })
        .expect("Event Invocation Error");
    }

    pub fn change_config(&mut self, config: Config) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(msg_src, storage);

        if !storage.tokens.is_empty() {
            panic("Config cannot be changed");
        }

        // made 10_000 so you can enter hundredths of a percent.
        if config.royalty > 10_000 {
            panic("Wrong royalty");
        }
        if config.transferable.is_none() && config.sellable.is_some() {
            panic("Not transferable");
        }

        if let Some(limit) = config.user_mint_limit {
            if limit == 0 {
                panic("Limit is zero");
            }
        }
        storage.config = config.clone();
        self.emit_event(Event::ConfigChanged { config })
            .expect("Event Invocation Error");
    }

    pub fn add_users_for_mint(&mut self, users: Vec<ActorId>) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(msg_src, storage);
        if let Some(allowed_users) = &mut storage.permission_to_mint {
            allowed_users.extend(users.clone());
            allowed_users.sort();
            allowed_users.dedup();
        } else if storage.tokens.is_empty() {
            let mut new_users = users.clone();
            new_users.push(msg_src);
            storage.permission_to_mint = Some(new_users);
        } else {
            panic("User restriction cannot be changed");
        }

        self.emit_event(Event::UsersForMintAdded { users })
            .expect("Event Invocation Error");
    }

    pub fn delete_user_for_mint(&mut self, user: ActorId) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(msg_src, storage);
        let allowed_users = storage
            .permission_to_mint
            .as_mut()
            .expect("No list of restriction");
        if let Some(pos) = allowed_users
            .iter()
            .position(|allowed_user| *allowed_user == user)
        {
            allowed_users.remove(pos);
        } else {
            panic("There is no such user");
        }

        self.emit_event(Event::UserForMintDeleted { user })
            .expect("Event Invocation Error");
    }

    pub fn lift_restrictions_mint(&mut self) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(msg_src, storage);

        if !storage.tokens.is_empty() {
            panic("User restriction cannot be changed");
        }
        storage.permission_to_mint = None;
        self.emit_event(Event::LiftRestrictionMint)
            .expect("Event Invocation Error");
    }

    pub fn add_admin(&mut self, admin: ActorId) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(msg_src, storage);
        storage.admins.insert(admin);
        self.emit_event(Event::AdminAdded { admin })
            .expect("Event Invocation Error");
    }

    pub fn remove_admin(&mut self, admin: ActorId) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(msg_src, storage);
        if storage.admins.len() == 1 {
            panic("Only one admin left");
        }
        storage.admins.remove(&admin);
        self.emit_event(Event::AdminRemoved { admin })
            .expect("Event Invocation Error");
    }

    pub fn add_metadata(&mut self, nft_id: u64, metadata: String) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(msg_src, storage);
        check_variable_meta(storage);
        let nft = storage
            .tokens
            .get_mut(&nft_id)
            .expect("Token does not exist");

        nft.metadata.push(metadata.clone());
        self.emit_event(Event::MetadataAdded { nft_id, metadata })
            .expect("Event Invocation Error");
    }

    pub fn change_img_link(&mut self, nft_id: u64, img_link: String) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(msg_src, storage);
        check_variable_meta(storage);
        let nft = storage
            .tokens
            .get_mut(&nft_id)
            .expect("Token does not exist");
        nft.media_url = img_link.clone();
        self.emit_event(Event::ImageLinkChanged { nft_id, img_link })
            .expect("Event Invocation Error");
    }

    pub fn change_metadata(&mut self, nft_id: u64, metadata: Vec<String>) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(msg_src, storage);
        check_variable_meta(storage);
        let nft = storage
            .tokens
            .get_mut(&nft_id)
            .expect("Token does not exist");
        nft.metadata = metadata.clone();
        self.emit_event(Event::MetadataChanged { nft_id, metadata })
            .expect("Event Invocation Error");
    }

    pub fn delete_metadata(&mut self, nft_id: u64) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(msg_src, storage);
        check_variable_meta(storage);
        let nft = storage
            .tokens
            .get_mut(&nft_id)
            .expect("Token does not exist");
        nft.metadata = vec![];
        self.emit_event(Event::MetadataDeleted { nft_id })
            .expect("Event Invocation Error");
    }

    // Service's query
    pub fn get_token_info(&self, token_id: NftId) -> TokenInfo {
        let storage = self.get();
        let nft = storage.tokens.get(&token_id).expect("Token does not exist");

        let can_sell = storage
            .config
            .sellable
            .map(|time| exec::block_timestamp() >= nft.mint_time + time)
            .unwrap_or_default();

        let approval = storage.token_approvals.get(&token_id).copied();

        TokenInfo {
            token_owner: nft.owner,
            approval,
            sellable: can_sell,
            collection_owner: storage.collection_owner,
            royalty: storage.config.royalty,
        }
    }

    pub fn get_payment_for_mint(&self) -> u128 {
        self.get().config.payment_for_mint
    }

    pub fn can_delete(&self) -> bool {
        self.get().tokens.is_empty()
    }

    pub fn name(&self) -> String {
        self.get().config.name.clone()
    }

    pub fn description(&self) -> String {
        self.get().config.description.clone()
    }

    pub fn config(&self) -> &'static Config {
        &self.get().config
    }

    pub fn marketplace_address(&self) -> ActorId {
        self.get().marketplace_address
    }

    pub fn collection_owner(&self) -> ActorId {
        self.get().collection_owner
    }

    pub fn nonce(&self) -> u64 {
        self.get().nonce
    }

    pub fn img_links_and_data(&self) -> &'static Vec<(String, ImageData)> {
        &self.get().img_links_and_data
    }

    pub fn permission_to_mint(&self) -> &'static Option<Vec<ActorId>> {
        &self.get().permission_to_mint
    }

    pub fn total_number_of_tokens(&self) -> &'static Option<u64> {
        &self.get().total_number_of_tokens
    }

    pub fn all(&self) -> NftState {
        self.get().into()
    }

    pub fn get_tokens_id_by_owner(&self, owner_id: ActorId) -> Vec<NftId> {
        let mut tokens: Vec<NftId> = self
            .get()
            .owners
            .get(&owner_id)
            .unwrap_or(&HashSet::new())
            .iter()
            .cloned()
            .collect();
        
        tokens.sort();
        tokens
    }

    pub fn get_tokens_info_by_owner(&self, owner_id: ActorId) -> Vec<NftData> {
        let s = self.get();
        let mut pairs: Vec<(NftId, NftData)> = s.owners.get(&owner_id)
            .into_iter()
            .flat_map(|ids| ids.iter())
            .filter_map(|id| s.tokens.get(id).cloned().map(|d| (*id, d)))
            .collect();

        pairs.sort_by_key(|(id, _)| *id);
        pairs.into_iter().map(|(_, d)| d).collect()
    }
}

pub struct NftProgram(());

#[sails_rs::program]
impl NftProgram {
    // Program's constructor
    pub fn new(
        collection_owner: ActorId,
        config: Config,
        img_links_and_data: Vec<(String, ImageData)>,
        permission_to_mint: Option<Vec<ActorId>>,
    ) -> Self {
        NftService::init(
            collection_owner,
            config,
            img_links_and_data,
            permission_to_mint,
        );
        Self(())
    }

    // Exposed service
    pub fn nft(&self) -> NftService {
        NftService::new()
    }
}
