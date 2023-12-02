#![no_std]
use gstd::{
    collections::{HashMap, HashSet},
    debug, exec, msg,
    prelude::*,
    ActorId,
};
use nft_io::{
    Config, Nft, NftAction, NftError, NftEvent, NftId, NftInit, NftState, StateQuery, StateReply,
};

#[derive(Debug)]
struct NftContract {
    pub tokens: HashMap<NftId, Nft>,
    pub owners: HashMap<ActorId, HashSet<NftId>>,
    pub restriction_mint: HashMap<ActorId, u32>, // made in order to track the number of mint nft
    pub token_approvals: HashMap<NftId, HashSet<ActorId>>,
    pub config: Config,
    pub nonce: NftId,
    pub img_links: Vec<(String, u32)>,
    pub admins: Vec<ActorId>,
}
static mut NFT_CONTRACT: Option<NftContract> = None;

impl NftContract {
    fn add_admin(&mut self, new_admin: &ActorId) -> Result<NftEvent, NftError> {
        self.check_admin()?;
        self.admins.push(*new_admin);
        Ok(NftEvent::AdminAdded)
    }
    fn mint(&mut self) -> Result<NftEvent, NftError> {
        let msg_src = msg::source();
        self.check_tokens()?;
        self.check_mint_limit(&msg_src)?;

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
            return Err(NftError::Error("Math overflow.".to_owned()));
        };
        self.nonce = next_nft_nonce;

        Ok(NftEvent::Minted {
            owner: msg_src,
            token_id: next_nft_nonce,
            media_url: img_link.unwrap(),
            attrib_url: "".to_string(),
        })
    }
    fn transfer_from(
        &mut self,
        from: &ActorId,
        to: &ActorId,
        token_id: NftId,
    ) -> Result<NftEvent, NftError> {
        self.can_transfer(from, to, &token_id)?;

        let nft = self
            .tokens
            .get_mut(&token_id)
            .expect("NonFungibleToken: token does not exist");

        nft.owner = *to;

        if let Some(tokens) = self.owners.get_mut(from) {
            tokens.retain(|&token| token != token_id);
            if tokens.is_empty() {
                self.owners.remove(from);
            }
        } else {
            return Err(NftError::Error(
                "Fatal: owner does not contain nft id.".to_owned(),
            ));
        }

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

        self.token_approvals.remove(&token_id);

        Ok(NftEvent::Transferred {
            owner: *from,
            recipient: *to,
            token_id,
        })
    }
    fn approve(&mut self, to: &ActorId, token_id: NftId) -> Result<NftEvent, NftError> {
        self.can_approve(&token_id)?;
        self.token_approvals
            .entry(token_id)
            .and_modify(|approvals| {
                approvals.insert(*to);
            })
            .or_insert_with(|| HashSet::from([*to]));

        Ok(NftEvent::Approved {
            account: *to,
            token_id,
        })
    }

    fn revoke_approve(&mut self, to: &ActorId, token_id: NftId) -> Result<NftEvent, NftError> {
        self.can_approve(&token_id)?;
        if let Some(approvals) = self.token_approvals.get_mut(&token_id) {
            if approvals.remove(to) {
                return Err(NftError::Error("This user has no approvals".to_owned()));
            }
            if approvals.is_empty() {
                self.token_approvals.remove(&token_id);
            }
        } else {
            return Err(NftError::Error(
                "No approve has been issued to this token".to_owned(),
            ));
        }
        Ok(NftEvent::ApprovalRevoked { token_id })
    }
    fn burn(&mut self, token_id: NftId) -> Result<NftEvent, NftError> {
        self.can_burn(&token_id)?;
        let nft = self.tokens.remove(&token_id).expect("Can't be None");
        if let Some(tokens) = self.owners.get_mut(&nft.owner) {
            if tokens.remove(&token_id) {
                return Err(NftError::Error(
                    "Fatal: owner does not contain nft id.".to_owned(),
                ));
            }
        } else {
            return Err(NftError::Error(
                "Fatal: owner does not contain list.".to_owned(),
            ));
        }

        self.token_approvals.remove(&token_id);

        Ok(NftEvent::Burnt { token_id })
    }

    fn is_approved_to(&self, to: &ActorId, token_id: NftId) -> Result<NftEvent, NftError> {
        let approval = self.token_approvals.get(&token_id);
        if let Some(approve) = approval {
            let is_approved = approve.contains(to);
            Ok(NftEvent::IsApproved {
                to: *to,
                token_id,
                approved: is_approved,
            })
        } else {
            Err(NftError::Error(
                "NonFungibleToken: token has no approvals".to_owned(),
            ))
        }
    }
    fn owner(&self, token_id: NftId) -> Result<NftEvent, NftError> {
        let nft = self.tokens.get(&token_id);
        if let Some(nft) = nft {
            return Ok(NftEvent::Owner {
                owner: nft.owner,
                token_id,
            });
        }
        Err(NftError::Error(
            "NonFungibleToken: token does not exist".to_owned(),
        ))
    }
    fn is_sellable(&self) -> Result<NftEvent, NftError> {
        Ok(NftEvent::IsSellable(self.config.sellable))
    }
    fn expand(&mut self, additional_links: Vec<(String, u32)>) -> Result<NftEvent, NftError> {
        self.check_admin()?;

        if additional_links.iter().any(|&(_, value)| value == 0) {
            return Err(NftError::Error(
                "Limit of copies value is equal to 0".to_owned(),
            ));
        }

        self.img_links.extend(additional_links.clone());

        Ok(NftEvent::Expanded { additional_links })
    }

    fn change_config(&mut self, config: Config) -> Result<NftEvent, NftError> {
        self.check_admin()?;

        if !self.tokens.is_empty() {
            return Err(NftError::Error(
                "The collection configuration can no more be changed".to_owned(),
            ));
        }

        if let Some(limit) = config.mint_limit {
            if limit == 0 {
                return Err(NftError::Error(
                    "The mint limit must be greater than zero".to_owned(),
                ));
            }
        }
        self.config = config.clone();
        Ok(NftEvent::ConfigChanged { config })
    }

    fn check_admin(&self) -> Result<(), NftError> {
        if !self.admins.contains(&msg::source()) {
            return Err(NftError::Error(
                "Only admin can send this message".to_owned(),
            ));
        }
        Ok(())
    }

    fn check_tokens(&self) -> Result<(), NftError> {
        if self.img_links.is_empty() {
            return Err(NftError::Error("All tokens are minted.".to_owned()));
        }
        Ok(())
    }
    fn check_mint_limit(&self, user: &ActorId) -> Result<(), NftError> {
        if let Some(limit) = self.config.mint_limit {
            if let Some(number_tokens) = self.restriction_mint.get(user) {
                if number_tokens >= &limit && !self.admins.contains(user) {
                    return Err(NftError::Error("You've exhausted your limit.".to_owned()));
                }
            }
        }
        Ok(())
    }
    fn can_approve(&self, token_id: &NftId) -> Result<(), NftError> {
        if !self.config.approvable {
            return Err(NftError::Error("Nft is not approvable.".to_owned()));
        }
        if let Some(nft_info) = self.tokens.get(token_id) {
            if nft_info.owner != msg::source() {
                return Err(NftError::Error(
                    "Only nft owner can send this message".to_owned(),
                ));
            }
        } else {
            return Err(NftError::Error(
                "This nft id hasn't come out yet".to_owned(),
            ));
        }

        Ok(())
    }
    fn check_approve(&self, user: &ActorId, token_id: &NftId) -> Result<(), NftError> {
        if let Some(approved_account) = self.token_approvals.get(token_id) {
            if !approved_account.contains(user) {
                return Err(NftError::Error(
                    "Caller is not approved to perform transfer.".to_owned(),
                ));
            }
        } else {
            return Err(NftError::Error(
                "Target token_approvals is empty.".to_owned(),
            ));
        }
        Ok(())
    }

    fn can_transfer(&self, from: &ActorId, to: &ActorId, token_id: &NftId) -> Result<(), NftError> {
        if !self.config.transferable {
            return Err(NftError::Error("Nft is not transferable.".to_owned()));
        }

        let nft = self.tokens.get(token_id);

        if let Some(nft) = nft {
            let owner = nft.owner;
            if owner != *from {
                return Err(NftError::Error(
                    "NonFungibleToken: access denied".to_owned(),
                ));
            }
            let msg_src = msg::source();
            if owner != msg_src {
                self.check_approve(&msg_src, token_id)?;
            }
        } else {
            return Err(NftError::Error(
                "NonFungibleToken: token does not exist".to_owned(),
            ));
        }

        if from == to {
            return Err(NftError::Error("Self transfer is not allowed.".to_owned()));
        }
        Ok(())
    }

    fn can_burn(&self, token_id: &NftId) -> Result<(), NftError> {
        if !self.config.burnable {
            return Err(NftError::Error("Nft is not burnable.".to_owned()));
        }
        if let Some(nft_info) = self.tokens.get(token_id) {
            if nft_info.owner != msg::source() {
                return Err(NftError::Error(
                    "Only nft owner can send this message".to_owned(),
                ));
            }
        } else {
            return Err(NftError::Error(
                "This nft id hasn't come out yet".to_owned(),
            ));
        }

        Ok(())
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

    assert!(
        config.mint_limit.map(|limit| limit > 0).unwrap_or(true),
        "The mint limit must be greater than zero"
    );
    assert!(
        !img_links.is_empty(),
        "There must be at least one link to create a collection"
    );
    if img_links.iter().any(|&(_, value)| value == 0) {
        panic!("Limit of copies value is equal to 0");
    }

    unsafe {
        NFT_CONTRACT = Some(NftContract {
            tokens: HashMap::new(),
            owners: HashMap::new(),
            token_approvals: HashMap::new(),
            restriction_mint: HashMap::new(),
            config,
            nonce: 0,
            img_links,
            admins: vec![owner],
        })
    };
    msg::reply(NftEvent::Initialized, 0).expect("Error during a reply `NftEvent::Initialized`");
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
            nft_contract.transfer_from(&from, &to, token_id)
        }
        NftAction::Transfer { to, token_id } => nft_contract.transfer_from(&user, &to, token_id),
        NftAction::Approve { to, token_id } => nft_contract.approve(&to, token_id),
        NftAction::RevokeApproval { to, token_id } => nft_contract.revoke_approve(&to, token_id),
        NftAction::Burn { token_id } => nft_contract.burn(token_id),
        NftAction::Expand { additional_links } => nft_contract.expand(additional_links),
        NftAction::ChangeConfig { config } => nft_contract.change_config(config),
        NftAction::IsApproved { to, token_id } => nft_contract.is_approved_to(&to, token_id),
        NftAction::Owner { token_id } => nft_contract.owner(token_id),
        NftAction::IsSellable => nft_contract.is_sellable(),
    };

    msg::reply(result, 0).expect("Failed to encode or reply with `Result<NftEvent, NftError>`.");
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
            token_approvals,
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
            .map(|(actor_id, token_set)| (*actor_id, token_set.iter().copied().collect()))
            .collect();
        let token_approvals = token_approvals
            .iter()
            .map(|(nft_id, actor_set)| (*nft_id, actor_set.iter().copied().collect()))
            .collect();

        Self {
            tokens,
            owners,
            token_approvals,
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
