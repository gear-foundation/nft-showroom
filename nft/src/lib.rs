#![no_std]
use gstd::{
    collections::{HashMap, HashSet},
    debug, msg,
    prelude::*,
    ActorId, exec
};
use nft_io::{Config, Nft, NftAction, NftEvent, NftId, NftInit, NftState, StateQuery, StateReply};

#[derive(Debug)]
struct NftContract {
    pub tokens: HashMap<NftId, Nft>,
    pub owners: HashMap<ActorId, HashSet<NftId>>,
    pub restriction_mint: HashMap<ActorId, u32>, // made in order to track the number of mint nft
    pub approvals: HashMap<NftId, ActorId>,
    pub config: Config,
    pub nonce: NftId,
    pub img_links: Vec<(String, u32)>,
    pub admins: Vec<ActorId>,
    pub address_marketplace: ActorId,
}
static mut NFT_CONTRACT: Option<NftContract> = None;

impl NftContract {
    fn add_admin(&mut self, new_admin: &ActorId) -> NftEvent {
        if !self.admins.contains(&msg::source()) {
            return NftEvent::Error("Only admin can send this message".to_owned());
        }
        self.admins.push(*new_admin);
        NftEvent::AdminAdded
    }
    fn mint(&mut self) -> NftEvent {
        let msg_src = msg::source();

        if self.img_links.len() == 0 {
            return NftEvent::Error("All tokens are minted.".to_owned());
        }

        if let Some(limit) = self.config.mint_limit {
            if let Some(number_tokens) = self.restriction_mint.get(&msg_src) {
                if number_tokens >= &limit && !self.admins.contains(&msg_src) {
                    return NftEvent::Error("You've exhausted your limit.".to_owned());
                }
            }
        }

        let rand_index = get_random_value(self.img_links.len() as u64);

        let mut img_link: Option<String> = None;

        if let Some((link, number_copies)) = self.img_links.get_mut(rand_index as usize) {
            *number_copies -= 1;
            img_link = Some(link.clone());
            if *number_copies == 0 {
                self.img_links.remove(rand_index as usize);
            }
        }

        self.owners
            .entry(msg_src)
            .and_modify(|ids| {
                ids.insert(self.nonce);
            })
            .or_insert_with(|| {
                let mut ids = HashSet::new();
                ids.insert(self.nonce);

                ids
            });

        let name = format!("{} - {}", self.config.name, self.nonce);
        self.tokens.insert(
            self.nonce,
            Nft {
                owner: msg_src,
                name,
                description: self.config.description.clone(),
                media_url: img_link.clone().unwrap(),
                attrib_url: "".to_string(),
            },
        );
        self.restriction_mint
            .entry(msg_src)
            .and_modify(|ids| {
                *ids += 1;
            })
            .or_insert(1);

        let Some(next_nft_nonce) = self.nonce.checked_add(1) else {
            return NftEvent::Error("Math overflow.".to_owned());
        };
        self.nonce = next_nft_nonce;

        NftEvent::Minted {
            owner: msg_src,
            token_id: next_nft_nonce,
            media_url: img_link.unwrap(),
            attrib_url: "".to_string(),
        }
    }

    fn transfer_from(
        &mut self,
        user: &ActorId,
        from: &ActorId,
        to: &ActorId,
        token_id: NftId,
    ) -> NftEvent {
        debug!("USER {:?}, FROM {:?}, TO {:?}", user, from, to);
        if !self.config.transferable {
            return NftEvent::Error("Nft is not transferable.".to_owned());
        }
        // 1. Check approve
        if user != from {
            if let Some(approved_account) = self.approvals.get(&token_id) {
                if approved_account != user {
                    return NftEvent::Error(
                        "Caller is not approved to perform transfer.".to_owned(),
                    );
                }
            } else {
                return NftEvent::Error("Target approvals is empty.".to_owned());
            }
        }

        if from == to {
            return NftEvent::Error("Self transfer is not allowed.".to_owned());
        }

        // 2. Check that `from` owns nft by `token_id`
        if let Some(nft) = self.tokens.get_mut(&token_id) {
            if nft.owner == *from {
                // 3. Remove `from` nft id
                if let Some(from_nfts) = self.owners.get_mut(from) {
                    from_nfts.remove(&token_id);
                } else {
                    return NftEvent::Error("Fatal: owner does not contain nft id.".to_owned());
                }

                // 4. Update nft owner
                nft.owner = *to;

                // 5. Add `to` nft id
                self.owners
                    .entry(*to)
                    .and_modify(|ids| {
                        ids.insert(token_id);
                    })
                    .or_insert_with(|| {
                        let mut ids = HashSet::new();
                        ids.insert(token_id);

                        ids
                    });

                // 6. Remove old approve
                self.approvals.remove(&token_id);

                NftEvent::Transferred {
                    owner: *from,
                    recipient: *to,
                    token_id,
                }
            } else {
                NftEvent::Error("Invalid owner.".to_owned())
            }
        } else {
            NftEvent::Error("Provided nft does not exist.".to_owned())
        }
    }

    fn approve(&mut self, user: &ActorId, to: &ActorId, token_id: NftId) -> NftEvent {
        if !self.config.approvable {
            return NftEvent::Error("Nft is not approvable.".to_owned());
        }

        if let Some(nft_info) = self.tokens.get(&token_id) {
            if nft_info.owner == *user {
                if let Some(_approved_account) = self.approvals.get(&token_id) {
                    return NftEvent::Error("Already have an approved account".to_owned());
                } else {
                    self.approvals.insert(token_id, *to);
                }
            } else {
                return NftEvent::Error("Only nft owner can send this message".to_owned());
            }
        } else {
            return NftEvent::Error("This nft id hasn't come out yet".to_owned());
        }

        NftEvent::Approved {
            account: *to,
            token_id,
        }
    }

    fn revoke_approve(&mut self, user: &ActorId, token_id: NftId) -> NftEvent {
        if !self.config.approvable {
            return NftEvent::Error("Nft is not approvable.".to_owned());
        }

        if let Some(nft_info) = self.tokens.get(&token_id) {
            if nft_info.owner == *user {
                if let Some(_approved_account) = self.approvals.get(&token_id) {
                    self.approvals.remove(&token_id);
                } else {
                    return NftEvent::Error("There are no approved accounts to revoke".to_owned());
                }
            } else {
                return NftEvent::Error("Only nft owner can send this message".to_owned());
            }
        } else {
            return NftEvent::Error("This nft id hasn't come out yet".to_owned());
        }

        NftEvent::ApprovalRevoked { token_id }
    }

    fn burn(&mut self, user: &ActorId, token_id: NftId) -> NftEvent {
        if !self.config.burnable {
            return NftEvent::Error("Nft is not burnable.".to_owned());
        }

        if let Some(nft_info) = self.tokens.clone().get(&token_id) {
            if nft_info.owner == *user {
                self.tokens.remove(&token_id).expect("Can't be None");
                let tokens: &mut HashSet<u64> = self.owners.get_mut(&nft_info.owner).expect("Can't be None");
                tokens.remove(&token_id);
                // self.owners.remove(&nft_info.owner).expect("Can't be None");
                self.approvals.remove(&token_id);
            } else {
                return NftEvent::Error("Only nft owner can send this message".to_owned());
            }
        } else {
            return NftEvent::Error("This nft id hasn't come out yet".to_owned());
        }

        NftEvent::Burnt { token_id }
    }

    fn is_approved_to(&self, to: &ActorId, token_id: NftId) -> NftEvent {
        let approved = self
            .approvals
            .get(&token_id)
            .expect("NonFungibleToken: token has no approvals")
            .eq(to);
        NftEvent::IsApproved {
            to: *to,
            token_id,
            approved,
        }
    }
    fn owner(&self, token_id: NftId) -> NftEvent {
        let owner = self
            .tokens
            .get(&token_id)
            .expect("NonFungibleToken: token does not exist")
            .owner;

        NftEvent::Owner {
            owner: owner,
            token_id,
        }
    }

    fn expand(&mut self, user: &ActorId, additional_links: Vec<(String, u32)>) -> NftEvent {

        if !self.admins.contains(user) {
            return NftEvent::Error("Only admin can send this message".to_owned());
        }
        if additional_links.iter().any(|&(_, value)| value == 0) {
            return NftEvent::Error("Limit of copies value is equal to 0".to_owned());
        }

        self.img_links.extend(additional_links.clone());

        NftEvent::Expanded { additional_links }
    }
    fn change_config(&mut self, user: &ActorId, config: Config) -> NftEvent {
        if !self.admins.contains(user) {
            return NftEvent::Error("Only admin can send this message".to_owned());
        }
        if !self.tokens.is_empty(){
            return NftEvent::Error("The collection configuration can no more be changed".to_owned());
        }

        if let Some(limit) = config.mint_limit{
            if limit == 0{
                return NftEvent::Error("The mint limit must be greater than zero".to_owned());
            }
        }
        self.config = config.clone();
        NftEvent::ConfigChanged { config }
        
    }
}

#[no_mangle]
extern "C" fn init() {
    let NftInit {
        owner,
        config,
        img_links,
    } = msg::load().expect("Unable to decode `NftInit`.");
    debug!("INIT NFT");

    assert!(config.mint_limit.map(|limit| limit > 0).unwrap_or(true), "The mint limit must be greater than zero");
    assert!(img_links.len() > 0, "There must be at least one link to create a collection");
    if img_links.iter().any(|&(_, value)| value == 0) {
        panic!("Limit of copies value is equal to 0");
    }

    unsafe {
        NFT_CONTRACT = Some(NftContract {
            tokens: HashMap::new(),
            owners: HashMap::new(),
            approvals: HashMap::new(),
            restriction_mint: HashMap::new(),
            config,
            nonce: 0,
            img_links,
            admins: vec![owner],
            address_marketplace: msg::source(),
        })
    };
    msg::reply(
        NftEvent::Initialized,
        0,
    )
    .expect("Error during a reply `NftEvent::Initialized`");
    
}

#[no_mangle]
extern "C" fn handle() {
    let action: NftAction = msg::load().expect("Could not load `NftAction`.");
    let nft_contract: &mut NftContract = unsafe {
        NFT_CONTRACT
            .as_mut()
            .expect("Unexpected uninitialized `NftContract`.")
    };

    let user = msg::source();

    let result = match action {
        NftAction::AddAdmin { new_admin } => nft_contract.add_admin(&new_admin),
        NftAction::Mint => nft_contract.mint(),
        NftAction::TransferFrom { from, to, token_id } => {
            nft_contract.transfer_from(&user, &from, &to, token_id)
        }
        NftAction::Transfer { to, token_id } => {
            nft_contract.transfer_from(&user, &user, &to, token_id)
        }
        NftAction::Approve { to, token_id } => nft_contract.approve(&user, &to, token_id),
        NftAction::RevokeApproval { token_id } => nft_contract.revoke_approve(&user, token_id),
        NftAction::Burn { token_id } => nft_contract.burn(&user, token_id),
        NftAction::Expand { additional_links } => nft_contract.expand(&user, additional_links),
        NftAction::ChangeConfig { config } => nft_contract.change_config(&user, config),
        NftAction::IsApproved { to, token_id } => nft_contract.is_approved_to(&to, token_id),
        NftAction::Owner { token_id } => nft_contract.owner(token_id),
    };

    msg::reply(result, 0).expect("Failed to encode or reply with `NftEvent`.");
}

#[no_mangle]
extern "C" fn state() {
    let nft = unsafe {
        NFT_CONTRACT
            .take()
            .expect("Unexpected: The contract is not initialized")
    };
    let query: StateQuery = msg::load().expect("Unable to load the state query");
    match query {
        StateQuery::Name => {
            msg::reply(StateReply::Name(nft.config.name), 0).expect("Unable to share state");
        }
        StateQuery::Description => {
            msg::reply(StateReply::Description(nft.config.description), 0)
                .expect("Unable to share state");
        }
        StateQuery::Config => {
            msg::reply(StateReply::Config(nft.config), 0).expect("Unable to share state");
        }
        StateQuery::All => {
            let nft_state: NftState = nft.into();
            msg::reply(StateReply::All(nft_state), 0).expect("Unable to share state");
        }
    }
}

impl From<NftContract> for NftState {
    fn from(value: NftContract) -> Self {
        let NftContract {
            tokens,
            owners,
            approvals,
            config,
            nonce,
            img_links,
            admins,
            ..
        } = value;

        let tokens = tokens
            .iter()
            .map(|(nft_id, nft)| (*nft_id, nft.clone()))
            .collect();
        let owners = owners
            .iter()
            .map(|(k, v)| (*k, v.iter().copied().collect()))
            .collect();
        let approvals = approvals
            .iter()
            .map(|(nft_id, actor_id)| (*nft_id, *actor_id))
            .collect();

        Self {
            tokens,
            owners,
            approvals,
            config,
            nonce,
            img_links,
            admins,
        }
    }
}

static mut SEED: u8 = 0;

pub fn get_random_value(range: u64) -> u64 {
    let seed = unsafe { SEED };
    unsafe { SEED = SEED.wrapping_add(1) };
    let mut random_input: [u8; 32] = exec::program_id().into();
    let block_time = exec::block_timestamp() as u8;
    random_input[0] = random_input[0].wrapping_add(seed).wrapping_add(block_time);
    let (random, _) = exec::random(random_input).expect("Error in getting random number");
    let mut result: u64 = 0;

    for &byte in &random {
        result = (result << 8) | u64::from(byte);
    }

    result % range
}
