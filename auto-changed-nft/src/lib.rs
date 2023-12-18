#![no_std]
use auto_changed_nft_io::*;
use gstd::{
    collections::{HashMap, HashSet},
    debug, exec, msg,
    prelude::*,
    ActorId,
};

#[derive(Debug)]
struct NftContract {
    pub tokens: HashMap<NftId, Nft>,
    pub owners: HashMap<ActorId, HashSet<NftId>>,
    pub restriction_mint: HashMap<ActorId, u32>, // made in order to track the number of mint nft
    pub token_approvals: HashMap<NftId, ActorId>,
    pub config: Config,
    pub nonce: NftId,
    pub img_links: Vec<(Vec<String>, u32)>,
    // pub reservations: HashMap<NftId, ReservationId>,
    pub admins: Vec<ActorId>,
}
static mut NFT_CONTRACT: Option<NftContract> = None;

impl NftContract {
    fn add_admin(&mut self, new_admin: &ActorId) -> Result<AutoNftEvent, AutoNftError> {
        self.check_admin()?;
        self.admins.push(*new_admin);
        Ok(AutoNftEvent::AdminAdded)
    }
    fn mint(&mut self) -> Result<AutoNftEvent, AutoNftError> {
        let msg_src = msg::source();
        self.check_tokens()?;
        self.check_mint_limit(&msg_src)?;

        let rand_index = get_random_value(self.img_links.len() as u64);
        let mut img_link: Option<Vec<String>> = None;

        if let Some((link, number_copies)) = self.img_links.get_mut(rand_index as usize) {
            *number_copies -= 1;
            img_link = Some(link.clone());
            if *number_copies == 0 {
                self.img_links.remove(rand_index as usize);
            }
        }

        let Some(next_nft_nonce) = self.nonce.checked_add(1) else {
            return Err(AutoNftError("Math overflow.".to_owned()));
        };
        let token_id = self.nonce;
        self.nonce = next_nft_nonce;

        self.owners
            .entry(msg_src)
            .and_modify(|ids| {
                ids.insert(token_id);
            })
            .or_insert_with(|| {
                let mut ids = HashSet::new();
                ids.insert(token_id);

                ids
            });

        let name = format!("{} - {}", self.config.name, token_id);
        self.tokens.insert(
            token_id,
            Nft {
                owner: msg_src,
                name,
                description: self.config.description.clone(),
                media_url: (0, img_link.clone().unwrap()),
            },
        );
        self.restriction_mint
            .entry(msg_src)
            .and_modify(|ids| {
                *ids += 1;
            })
            .or_insert(1);

        self.config.time_to_action.iter().for_each(|event| {
            let action = match event.1 {
                Action::ChangeImg => AutoNftAction::ChangeImg { token_id },
            };
            msg::send_delayed(
                exec::program_id(),
                action,
                0,
                event.0 / BLOCK_DURATION_IN_SECS,
            )
            .expect("Error in sending a delayed message `AutoNftAction`");
        });

        Ok(AutoNftEvent::Minted {
            owner: msg_src,
            token_id,
            media_url: img_link.unwrap(),
        })
    }
    fn transfer_from(
        &mut self,
        from: &ActorId,
        to: &ActorId,
        token_id: NftId,
    ) -> Result<AutoNftEvent, AutoNftError> {
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
            return Err(AutoNftError(
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

        Ok(AutoNftEvent::Transferred {
            owner: *from,
            recipient: *to,
            token_id,
        })
    }
    fn approve(&mut self, to: &ActorId, token_id: NftId) -> Result<AutoNftEvent, AutoNftError> {
        self.can_approve(&token_id)?;
        self.token_approvals.insert(token_id, *to);

        Ok(AutoNftEvent::Approved {
            account: *to,
            token_id,
        })
    }

    fn revoke_approve(&mut self, token_id: NftId) -> Result<AutoNftEvent, AutoNftError> {
        self.can_approve(&token_id)?;
        let res = self.token_approvals.remove(&token_id);
        if res.is_none() {
            return Err(AutoNftError(
                "No approve has been issued to this token".to_owned(),
            ));
        }
        Ok(AutoNftEvent::ApprovalRevoked { token_id })
    }
    fn burn(&mut self, token_id: NftId) -> Result<AutoNftEvent, AutoNftError> {
        self.can_burn(&token_id)?;
        let nft = self.tokens.remove(&token_id).expect("Can't be None");
        if let Some(tokens) = self.owners.get_mut(&nft.owner) {
            if tokens.remove(&token_id) {
                return Err(AutoNftError(
                    "Fatal: owner does not contain nft id.".to_owned(),
                ));
            }
        } else {
            return Err(AutoNftError(
                "Fatal: owner does not contain list.".to_owned(),
            ));
        }

        self.token_approvals.remove(&token_id);

        Ok(AutoNftEvent::Burnt { token_id })
    }

    fn get_token_info(&self, token_id: NftId) -> Result<AutoNftEvent, AutoNftError> {
        let nft = self.tokens.get(&token_id);
        let owner = if let Some(nft) = nft {
            nft.owner
        } else {
            return Err(AutoNftError(
                "NonFungibleToken: token does not exist".to_owned(),
            ));
        };
        let approval = self.token_approvals.get(&token_id).copied();

        Ok(AutoNftEvent::TokenInfoReceived {
            owner,
            approval,
            sellable: self.config.sellable,
        })
    }
    fn expand(
        &mut self,
        additional_links: Vec<(Vec<String>, u32)>,
    ) -> Result<AutoNftEvent, AutoNftError> {
        self.check_admin()?;
        if !self.config.attendable {
            return Err(AutoNftError("Nft is not attendable.".to_owned()));
        }
        if additional_links.iter().any(|&(_, value)| value == 0) {
            return Err(AutoNftError(
                "Limit of copies value is equal to 0".to_owned(),
            ));
        }

        self.img_links.extend(additional_links.clone());

        Ok(AutoNftEvent::Expanded { additional_links })
    }

    fn change_config(&mut self, config: Config) -> Result<AutoNftEvent, AutoNftError> {
        self.check_admin()?;

        if !self.tokens.is_empty() {
            return Err(AutoNftError(
                "The collection configuration can no more be changed".to_owned(),
            ));
        }

        if let Some(limit) = config.user_mint_limit {
            if limit == 0 {
                return Err(AutoNftError(
                    "The mint limit must be greater than zero".to_owned(),
                ));
            }
        }
        self.config = config.clone();
        Ok(AutoNftEvent::ConfigChanged { config })
    }

    // fn start_auto_changing(
    //     &mut self,
    //     token_id: NftId,
    //     duration_sec: u32,
    //     interval_sec: u32,
    // ) -> Result<AutoNftEvent, AutoNftError> {
    //     let nft = self
    //         .tokens
    //         .get_mut(&token_id)
    //         .expect("AutoNft: token does not exist");

    //     if nft.owner != msg::source() {
    //         return Err(AutoNftError(
    //             "Only the owner can send this message".to_owned(),
    //         ));
    //     }

    //     nft.media_url.0 = (nft.media_url.0 + 1) % nft.media_url.1.len() as u32;

    //     // 892800 blocks per month
    //     // 201600 blocks per 7 days
    //     // 28800 blocks per day
    //     // 1200 blocks per hour
    //     let duration_block = duration_sec / 3;
    //     let interval_block = interval_sec / 3;
    //     let number_message = duration_block / interval_block;
    //     for i in 1..=number_message {
    //         msg::send_delayed(
    //             exec::program_id(),
    //             AutoNftAction::Update { token_id },
    //             0,
    //             interval_block * i,
    //         )
    //         .expect("Error in sending a delayed message `AutoNftAction::Update`");
    //     }

    //     Ok(AutoNftEvent::ChangeStarted { token_id })
    // }

    fn change_image(&mut self, token_id: NftId) -> Result<AutoNftEvent, AutoNftError> {
        if exec::program_id() != msg::source() {
            return Err(AutoNftError(
                "Only program can send this message".to_owned(),
            ));
        }
        let nft = self
            .tokens
            .get_mut(&token_id)
            .expect("AutoNft: token does not exist");

        nft.media_url.0 = (nft.media_url.0 + 1) % nft.media_url.1.len() as u32;

        Ok(AutoNftEvent::ImageChanged { token_id })
    }

    fn check_admin(&self) -> Result<(), AutoNftError> {
        if !self.admins.contains(&msg::source()) {
            return Err(AutoNftError("Only admin can send this message".to_owned()));
        }
        Ok(())
    }

    fn check_tokens(&self) -> Result<(), AutoNftError> {
        if self.img_links.is_empty() {
            return Err(AutoNftError("All tokens are minted.".to_owned()));
        }
        Ok(())
    }
    fn check_mint_limit(&self, user: &ActorId) -> Result<(), AutoNftError> {
        if let Some(limit) = self.config.user_mint_limit {
            if let Some(number_tokens) = self.restriction_mint.get(user) {
                if number_tokens >= &limit && !self.admins.contains(user) {
                    return Err(AutoNftError("You've exhausted your limit.".to_owned()));
                }
            }
        }
        Ok(())
    }
    fn can_approve(&self, token_id: &NftId) -> Result<(), AutoNftError> {
        if !self.config.approvable {
            return Err(AutoNftError("Nft is not approvable.".to_owned()));
        }
        if self.token_approvals.contains_key(token_id) {
            return Err(AutoNftError("Approve has already been issued".to_owned()));
        }
        if let Some(nft_info) = self.tokens.get(token_id) {
            if nft_info.owner != msg::source() {
                return Err(AutoNftError(
                    "Only nft owner can send this message".to_owned(),
                ));
            }
        } else {
            return Err(AutoNftError("This nft id hasn't come out yet".to_owned()));
        }

        Ok(())
    }
    fn check_approve(&self, user: &ActorId, token_id: &NftId) -> Result<(), AutoNftError> {
        if let Some(approved_account) = self.token_approvals.get(token_id) {
            if approved_account != user {
                return Err(AutoNftError(
                    "Caller is not approved to perform transfer.".to_owned(),
                ));
            }
        } else {
            return Err(AutoNftError("Target token_approvals is empty.".to_owned()));
        }
        Ok(())
    }

    fn can_transfer(
        &self,
        from: &ActorId,
        to: &ActorId,
        token_id: &NftId,
    ) -> Result<(), AutoNftError> {
        if !self.config.transferable {
            return Err(AutoNftError("Nft is not transferable.".to_owned()));
        }

        let nft = self.tokens.get(token_id);

        if let Some(nft) = nft {
            let owner = nft.owner;
            if owner != *from {
                return Err(AutoNftError("NonFungibleToken: access denied".to_owned()));
            }
            let msg_src = msg::source();
            if owner != msg_src {
                self.check_approve(&msg_src, token_id)?;
            }
        } else {
            return Err(AutoNftError(
                "NonFungibleToken: token does not exist".to_owned(),
            ));
        }

        if from == to {
            return Err(AutoNftError("Self transfer is not allowed.".to_owned()));
        }
        Ok(())
    }

    fn can_burn(&self, token_id: &NftId) -> Result<(), AutoNftError> {
        if !self.config.burnable {
            return Err(AutoNftError("Nft is not burnable.".to_owned()));
        }
        if let Some(nft_info) = self.tokens.get(token_id) {
            if nft_info.owner != msg::source() {
                return Err(AutoNftError(
                    "Only nft owner can send this message".to_owned(),
                ));
            }
        } else {
            return Err(AutoNftError("This nft id hasn't come out yet".to_owned()));
        }

        Ok(())
    }
}

#[no_mangle]
extern "C" fn init() {
    let AutoNftInit {
        owner,
        config,
        img_links,
    } = msg::load().expect("Unable to decode `AutoNftInit`.");
    debug!("INIT NFT");

    assert!(
        config
            .user_mint_limit
            .map(|limit| limit > 0)
            .unwrap_or(true),
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
            config: config.clone(),
            nonce: 0,
            img_links,
            // reservations: HashMap::new(),
            admins: vec![owner],
        })
    };
    msg::send(
        owner,
        AutoNftEvent::Initialized {
            config: config.clone(),
        },
        0,
    )
    .expect("Error during send to owner `AutoNftEvent::Initialized`");
    msg::reply(AutoNftEvent::Initialized { config }, 0)
        .expect("Error during a reply `AutoNftEvent::Initialized`");
}

#[no_mangle]
extern "C" fn handle() {
    let action: AutoNftAction = msg::load().expect("Could not load `AutoNftAction`.");
    let nft_contract: &mut NftContract = unsafe {
        NFT_CONTRACT
            .as_mut()
            .expect("Unexpected uninitialized `NftContract`.")
    };

    let user = msg::source();

    let result = match action {
        AutoNftAction::AddAdmin { new_admin } => nft_contract.add_admin(&new_admin),
        AutoNftAction::Mint => nft_contract.mint(),
        AutoNftAction::TransferFrom { from, to, token_id } => {
            nft_contract.transfer_from(&from, &to, token_id)
        }
        AutoNftAction::Transfer { to, token_id } => {
            nft_contract.transfer_from(&user, &to, token_id)
        }
        AutoNftAction::Approve { to, token_id } => nft_contract.approve(&to, token_id),
        AutoNftAction::RevokeApproval { token_id } => nft_contract.revoke_approve(token_id),
        AutoNftAction::Burn { token_id } => nft_contract.burn(token_id),
        AutoNftAction::Expand { additional_links } => nft_contract.expand(additional_links),
        AutoNftAction::ChangeConfig { config } => nft_contract.change_config(config),
        AutoNftAction::GetTokenInfo { token_id } => nft_contract.get_token_info(token_id),
        AutoNftAction::ChangeImg { token_id } => nft_contract.change_image(token_id),
    };

    msg::reply(result, 0)
        .expect("Failed to encode or reply with `Result<AutoNftEvent, AutoNftError>`.");
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
            let nft_state: AutoNftState = nft.into();
            msg::reply(StateReply::All(nft_state), 0).expect("Unable to share state");
        }
    }
}

impl From<NftContract> for AutoNftState {
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
            .map(|(nft_id, actor_id)| (*nft_id, *actor_id))
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
