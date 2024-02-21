#![no_std]
use ai_nft_io::{
    Config, Nft, NftAction, NftError, NftEvent, NftId, NftInit, NftState, StateQuery, StateReply,
    EXISTENTIAL_DEPOSIT,
};
use gstd::{
    collections::{HashMap, HashSet},
    exec, msg,
    prelude::*,
    ActorId,
};

#[derive(Debug)]
struct NftContract {
    pub tokens: HashMap<NftId, Nft>,
    pub owners: HashMap<ActorId, HashSet<NftId>>,
    pub restriction_mint: HashMap<ActorId, u32>, // made in order to track the number of mint!(not transfer) nft
    pub pending_mint: HashMap<(ActorId, u32), Vec<String>>,
    pub token_approvals: HashMap<NftId, ActorId>,
    pub config: Config,
    pub nonce: NftId,
    pub collection_owner: ActorId,
    pub permission_to_mint: Option<Vec<ActorId>>,
    pub dictionary: Vec<String>,
    pub total_number_of_tokens: Option<u64>,
    pub waiting_time_sec: u32,
}
static mut NFT_CONTRACT: Option<NftContract> = None;

impl NftContract {
    fn first_phase_mint(
        &mut self,
        msg_src: ActorId,
        msg_value: u128,
    ) -> Result<NftEvent, NftError> {
        // check if a user can make a mint:
        // - quantity limit
        // - user-specific limit
        self.check_mint(&msg_src)?;

        if self.nonce.checked_add(1).is_none() {
            return Err(NftError::MathOverflow);
        };
        // value check on mint
        self.payment_for_mint(msg_value)?;

        let words = self.get_random_words();

        let id = self
            .restriction_mint
            .entry(msg_src)
            .and_modify(|ids| {
                *ids += 1;
            })
            .or_insert(1);

        self.pending_mint.insert((msg_src, *id), words.clone());

        msg::send_delayed(
            exec::program_id(),
            NftAction::MintPhaseTwoCheck {
                minter: msg_src,
                personal_id: *id,
            },
            0,
            self.waiting_time_sec/3 + 1,
        )
        .expect("Error in sending delayed message"); 

        Ok(NftEvent::PhaseOneOfMintDone {
            minter_to_personal_id: (msg_src, *id),
            words,
        })
    }

    fn second_phase_mint(
        &mut self,
        minter: ActorId,
        personal_id: u32,
        img_link: String,
    ) -> Result<NftEvent, NftError> {
        let msg_src = msg::source();
        self.check_collection_owner(msg_src)?;

        let Some(next_nft_nonce) = self.nonce.checked_add(1) else {
            return Err(NftError::MathOverflow);
        };

        if !self.pending_mint.contains_key(&(minter, personal_id)) {
            return Err(NftError::NotOnPendingList);
        }

        let token_id = self.nonce;
        self.owners
            .entry(minter)
            .and_modify(|ids| {
                ids.insert(token_id);
            })
            .or_insert_with(|| HashSet::from([token_id]));

        let name = format!("{} - {}", self.config.name, token_id);
        let words = self.pending_mint.get(&(minter, personal_id)).expect("Critical error").join(", ");

        let nft_data = Nft {
            owner: minter,
            name,
            description: self.config.description.clone(),
            metadata: vec![words],
            media_url: img_link.clone(),
            mint_time: exec::block_timestamp(),
        };
        self.tokens.insert(token_id, nft_data.clone());
        self.nonce = next_nft_nonce;

        self.pending_mint.remove(&(minter, personal_id));

        // use send_with_gas to transfer the value directly to the balance, not to the mailbox.
        msg::send_with_gas(self.collection_owner, "", 0, self.config.payment_for_mint)
            .expect("Error in sending value");

        Ok(NftEvent::PhaseTwoOfMintDone { token_id, nft_data })
    }

    fn mint_phase_two_check(
        &mut self,
        minter: ActorId,
        personal_id: u32,
    ) -> Result<NftEvent, NftError> {
        if exec::program_id() != msg::source() {
            return Err(NftError::AccessDenied);
        }

        if self.pending_mint.contains_key(&(minter, personal_id)) {
            msg::send_with_gas(minter, "", 0, self.config.payment_for_mint)
                .expect("Error in sending value");
            self.restriction_mint.entry(minter).and_modify(|ids| {
                *ids -= 1;
            });
            self.pending_mint.remove(&(minter, personal_id));
        }

        Ok(NftEvent::Checked)
    }

    fn transfer_from(
        &mut self,
        from: &ActorId,
        to: &ActorId,
        token_id: NftId,
    ) -> Result<NftEvent, NftError> {
        // checking for the possibility to transfer
        self.can_transfer(from, to, &token_id)?;

        let nft = self
            .tokens
            .get_mut(&token_id)
            .ok_or(NftError::TokenDoesNotExist)?;
        let tokens = self
            .owners
            .get_mut(from)
            .ok_or(NftError::OwnerDoesNotHaveNft)?;
        tokens.retain(|&token| token != token_id);

        if tokens.is_empty() {
            self.owners.remove(from);
        }

        nft.owner = *to;

        self.owners
            .entry(*to)
            .and_modify(|ids| {
                ids.insert(token_id);
            })
            .or_insert_with(|| HashSet::from([token_id]));

        self.token_approvals.remove(&token_id);

        Ok(NftEvent::Transferred {
            owner: *from,
            recipient: *to,
            token_id,
        })
    }
    fn approve(&mut self, to: &ActorId, token_id: NftId) -> Result<NftEvent, NftError> {
        // checking for the possibility to give an approve
        self.can_approve(&token_id)?;
        self.token_approvals.insert(token_id, *to);

        Ok(NftEvent::Approved { to: *to, token_id })
    }

    fn revoke_approve(&mut self, token_id: NftId) -> Result<NftEvent, NftError> {
        let nft_info = self
            .tokens
            .get(&token_id)
            .ok_or(NftError::TokenDoesNotExist)?;
        if nft_info.owner != msg::source() {
            return Err(NftError::AccessDenied);
        }
        let _ = self
            .token_approvals
            .remove(&token_id)
            .ok_or(NftError::NoApproval);
        Ok(NftEvent::ApprovalRevoked { token_id })
    }

    fn get_token_info(&self, token_id: NftId) -> Result<NftEvent, NftError> {
        let nft = self
            .tokens
            .get(&token_id)
            .ok_or(NftError::TokenDoesNotExist)?;

        let can_sell = self
            .config
            .sellable
            .map(|time| exec::block_timestamp() >= nft.mint_time + time)
            .unwrap_or_default();

        let approval = self.token_approvals.get(&token_id).copied();

        Ok(NftEvent::TokenInfoReceived {
            token_owner: nft.owner,
            approval,
            sellable: can_sell,
            collection_owner: self.collection_owner,
            royalty: self.config.royalty,
        })
    }

    fn change_config(&mut self, config: Config) -> Result<NftEvent, NftError> {
        let msg_src = msg::source();
        self.check_collection_owner(msg_src)?;

        if !self.tokens.is_empty() || !self.pending_mint.is_empty() {
            return Err(NftError::ConfigCannotBeChanged);
        }

        // made 10_000 so you can enter hundredths of a percent.
        if config.royalty > 10_000 {
            return Err(NftError::WrongRoyalty);
        }
        if config.transferable.is_none() && config.sellable.is_some() {
            return Err(NftError::NotTransferable);
        }

        if let Some(limit) = config.user_mint_limit {
            if limit == 0 {
                return Err(NftError::LimitIsZero);
            }
        }
        self.config = config.clone();
        Ok(NftEvent::ConfigChanged { config })
    }

    fn change_image(&mut self, token_id: NftId, img_link: String) -> Result<NftEvent, NftError> {
        if exec::program_id() != msg::source() {
            return Err(NftError::AccessDenied);
        }

        let nft = self
            .tokens
            .get_mut(&token_id)
            .ok_or(NftError::TokenDoesNotExist)?;
        nft.media_url = img_link.clone();

        msg::send(
            nft.owner,
            NftEvent::ImageChanged {
                token_id,
                img_link: img_link.clone(),
            },
            0,
        )
        .expect("Error in sending NftEvent::ImageChanged");
        Ok(NftEvent::ImageChanged { token_id, img_link })
    }

    fn add_metadata(&mut self, token_id: NftId, metadata: String) -> Result<NftEvent, NftError> {
        if exec::program_id() != msg::source() {
            return Err(NftError::AccessDenied);
        }
        let nft = self
            .tokens
            .get_mut(&token_id)
            .ok_or(NftError::TokenDoesNotExist)?;
        nft.metadata.push(metadata.clone());

        msg::send(
            nft.owner,
            NftEvent::MetadataAdded {
                token_id,
                metadata: metadata.clone(),
            },
            0,
        )
        .expect("Error in sending NftEvent::MetadataAdded");
        Ok(NftEvent::MetadataAdded { token_id, metadata })
    }

    fn add_users_for_mint(&mut self, users: Vec<ActorId>) -> Result<NftEvent, NftError> {
        let msg_src = msg::source();
        self.check_collection_owner(msg_src)?;
        if let Some(allowed_users) = &mut self.permission_to_mint {
            allowed_users.extend(users.clone());
            allowed_users.sort();
            allowed_users.dedup();
        } else {
            if self.tokens.is_empty() {
                let mut new_users = users.clone();
                new_users.push(msg_src);
                self.permission_to_mint = Some(new_users);
            } else {
                return Err(NftError::UserRestrictionCannotBeChanged);
            }
        }

        Ok(NftEvent::UsersForMintAdded { users })
    }
    fn delete_user_for_mint(&mut self, user: ActorId) -> Result<NftEvent, NftError> {
        let msg_src = msg::source();
        self.check_collection_owner(msg_src)?;
        let allowed_users = self
            .permission_to_mint
            .as_mut()
            .ok_or(NftError::NoListOfRestriction)?;
        if let Some(pos) = allowed_users
            .iter()
            .position(|allowed_user| *allowed_user == user)
        {
            allowed_users.remove(pos);
        } else {
            return Err(NftError::ThereIsNoSuchUser);
        }

        Ok(NftEvent::UserForMintDeleted { user })
    }

    fn lift_restrictions_mint(&mut self) -> Result<NftEvent, NftError> {
        let msg_src = msg::source();
        self.check_collection_owner(msg_src)?;

        if !self.tokens.is_empty() {
            return Err(NftError::UserRestrictionCannotBeChanged);
        }
        self.permission_to_mint = None;

        Ok(NftEvent::LiftRestrictionMint)
    }
    fn expand_dictionary(&mut self, new_dictionary: Vec<String>) -> Result<NftEvent, NftError> {
        let msg_src = msg::source();
        self.check_collection_owner(msg_src)?;

        self.dictionary.extend(new_dictionary);

        Ok(NftEvent::DictionaryExpanded)
    }
    fn change_waiting_time(&mut self, time: u32) -> Result<NftEvent, NftError> {
        let msg_src = msg::source();
        self.check_collection_owner(msg_src)?;

        self.waiting_time_sec = time;
        Ok(NftEvent::WaitingTimeChanged(time))
    }
    
    fn can_delete(&self) -> Result<NftEvent, NftError> {
        Ok(NftEvent::CanDelete(self.tokens.is_empty()))
    }

    fn check_collection_owner(&self, msg_src: ActorId) -> Result<(), NftError> {
        if self.collection_owner != msg_src {
            return Err(NftError::AccessDenied);
        }
        Ok(())
    }

    fn check_mint(&self, user: &ActorId) -> Result<(), NftError> {
        if let Some(permission_to_mint) = &self.permission_to_mint {
            if !permission_to_mint.contains(user) {
                return Err(NftError::AccessDenied);
            }
        }

        if let Some(limit) = self.total_number_of_tokens {
            if limit < (self.tokens.len() + self.pending_mint.len()) as u64 {
                return Err(NftError::ExhaustedLimit);
            }
        }

        if let Some(limit) = self.config.user_mint_limit {
            if let Some(number_tokens) = self.restriction_mint.get(user) {
                if number_tokens >= &limit && self.collection_owner != *user {
                    return Err(NftError::ExhaustedLimit);
                }
            }
        }

        Ok(())
    }

    // Checking for sufficient mint value and sending the value to the creator
    fn payment_for_mint(&self, msg_value: u128) -> Result<(), NftError> {
        if msg_value != self.config.payment_for_mint {
            return Err(NftError::WrongValue);
        }

        Ok(())
    }
    // verification of approval
    fn can_approve(&self, token_id: &NftId) -> Result<(), NftError> {
        if self.token_approvals.contains_key(token_id) {
            return Err(NftError::ThereIsApproval);
        }
        let nft_info = self
            .tokens
            .get(token_id)
            .ok_or(NftError::TokenDoesNotExist)?;
        if nft_info.owner != msg::source() {
            return Err(NftError::AccessDenied);
        }
        Ok(())
    }

    // approval check
    fn check_approve(&self, user: &ActorId, token_id: &NftId) -> Result<(), NftError> {
        let approved_account = self
            .token_approvals
            .get(token_id)
            .ok_or(NftError::AccessDenied)?;
        if approved_account != user {
            return Err(NftError::AccessDenied);
        }

        Ok(())
    }

    // doing all the checks to verify that the transfer can be made
    fn can_transfer(&self, from: &ActorId, to: &ActorId, token_id: &NftId) -> Result<(), NftError> {
        let nft = self
            .tokens
            .get(token_id)
            .ok_or(NftError::TokenDoesNotExist)?;

        let owner = nft.owner;
        if owner != *from {
            return Err(NftError::AccessDenied);
        }
        let msg_src = msg::source();
        // if the owner of the token does not match the sender of the message, then check the approval
        if owner != msg_src {
            self.check_approve(&msg_src, token_id)?;
        }
        let time = self.config.transferable.ok_or(NftError::NotTransferable)?;
        if exec::block_timestamp() < nft.mint_time + time {
            return Err(NftError::NotTransferable);
        }

        if from == to {
            return Err(NftError::AccessDenied);
        }
        Ok(())
    }

    fn get_random_words(&self) -> Vec<String> {
        let mut index_words = Vec::with_capacity(5);
        let range = self.dictionary.len() as u64;
        while index_words.len() < 5 {
            let rand = get_random_value(range);
            if !index_words.contains(&rand) {
                index_words.push(rand);
            }
        }
        index_words
            .into_iter()
            .map(|index| self.dictionary[index as usize].clone())
            .collect()
    }
}

#[no_mangle]
extern "C" fn init() {
    let NftInit {
        collection_owner,
        config,
        mut permission_to_mint,
        dictionary,
        total_number_of_tokens,
        waiting_time_sec,
    } = msg::load().expect("Unable to decode `NftInit`.");

    assert!(
        config
            .user_mint_limit
            .map(|limit| limit > 0)
            .unwrap_or(true),
        "The mint limit must be greater than zero"
    );

    if config.payment_for_mint > 0 && config.payment_for_mint < EXISTENTIAL_DEPOSIT {
        panic!(
            "{}",
            format!(
                "The payment for mint must be greater than existential deposit ({})",
                EXISTENTIAL_DEPOSIT
            )
        );
    }

    // made 10_000 so hundredths of a percent could be entered.
    if config.royalty > 10_000 {
        panic!("Royalty percent must be less than 100%");
    }
    // can't be made sellable but not transferable.
    if config.transferable.is_none() && config.sellable.is_some() {
        panic!("Tokens must be transferable");
    }
    if dictionary.len() < 5 {
        panic!("The dictionary is too small");
    }

    if let Some(users) = permission_to_mint.as_mut() {
        if !users.contains(&collection_owner) {
            users.push(collection_owner);
        }
    }

    unsafe {
        NFT_CONTRACT = Some(NftContract {
            tokens: HashMap::new(),
            owners: HashMap::new(),
            token_approvals: HashMap::new(),
            restriction_mint: HashMap::new(),
            pending_mint: HashMap::new(),
            config: config.clone(),
            nonce: 0,
            collection_owner,
            permission_to_mint: permission_to_mint.clone(),
            total_number_of_tokens,
            dictionary,
            waiting_time_sec
        })
    };
    msg::send(
        collection_owner,
        Ok::<NftEvent, NftError>(NftEvent::Initialized {
            config: config.clone(),
            permission_to_mint: permission_to_mint.clone(),
        }),
        0,
    )
    .expect("Error during send to owner `NftEvent::Initialized`");
    msg::reply(
        NftEvent::Initialized {
            config,
            permission_to_mint,
        },
        0,
    )
    .expect("Error during send reply `NftEvent::Initialized`");
}

#[no_mangle]
extern "C" fn handle() {
    let action: NftAction = msg::load().expect("Could not load `NftAction`.");
    let nft_contract: &mut NftContract = unsafe {
        NFT_CONTRACT
            .as_mut()
            .expect("Unexpected uninitialized `NftContract`.")
    };

    let result = match action {
        NftAction::FirstPhaseOfMint => {
            let msg_source = msg::source();
            let msg_value = msg::value();
            let result = nft_contract.first_phase_mint(msg_source, msg_value);
            if result.is_err() {
                msg::send_with_gas(msg_source, "", 0, msg_value).expect("Error in sending value");
            }
            result
        }
        NftAction::SecondPhaseOfMint {
            minter,
            personal_id,
            img_link,
        } => nft_contract.second_phase_mint(minter, personal_id, img_link),
        NftAction::MintPhaseTwoCheck {
            minter,
            personal_id,
        } => nft_contract.mint_phase_two_check(minter, personal_id),
        NftAction::TransferFrom { from, to, token_id } => {
            nft_contract.transfer_from(&from, &to, token_id)
        }
        NftAction::Transfer { to, token_id } => {
            nft_contract.transfer_from(&msg::source(), &to, token_id)
        }
        NftAction::Approve { to, token_id } => nft_contract.approve(&to, token_id),
        NftAction::RevokeApproval { token_id } => nft_contract.revoke_approve(token_id),
        NftAction::ChangeConfig { config } => nft_contract.change_config(config),
        NftAction::GetTokenInfo { token_id } => nft_contract.get_token_info(token_id),
        NftAction::CanDelete => nft_contract.can_delete(),
        NftAction::ChangeImg { token_id, img_link } => {
            nft_contract.change_image(token_id, img_link)
        }
        NftAction::AddMetadata { token_id, metadata } => {
            nft_contract.add_metadata(token_id, metadata)
        }
        NftAction::AddUsersForMint { users } => nft_contract.add_users_for_mint(users),
        NftAction::DeleteUserForMint { user } => nft_contract.delete_user_for_mint(user),
        NftAction::LiftRestrictionMint => nft_contract.lift_restrictions_mint(),
        NftAction::ExpandDictionary(new_words) => nft_contract.expand_dictionary(new_words),
        NftAction::ChangeWaitingTime(time_sec) => nft_contract.change_waiting_time(time_sec),
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
    let reply = match query {
        StateQuery::Name => StateReply::Name(nft.config.name),
        StateQuery::Description => StateReply::Description(nft.config.description),
        StateQuery::Config => StateReply::Config(nft.config),
        StateQuery::All => {
            let nft_state: NftState = nft.into();
            StateReply::All(nft_state)
        }
    };
    msg::reply(reply, 0).expect("Unable to share state");
}

impl From<NftContract> for NftState {
    fn from(value: NftContract) -> Self {
        let NftContract {
            tokens,
            owners,
            token_approvals,
            config,
            nonce,
            collection_owner,
            permission_to_mint,
            pending_mint,
            total_number_of_tokens,
            waiting_time_sec,
            ..
        } = value;

        let tokens = tokens
            .into_iter()
            .map(|(nft_id, nft)| (nft_id, nft))
            .collect();
        let owners = owners
            .into_iter()
            .map(|(actor_id, token_set)| (actor_id, token_set.into_iter().collect()))
            .collect();
        let token_approvals = token_approvals
            .into_iter()
            .map(|(nft_id, actor_id)| (nft_id, actor_id))
            .collect();

        let pending_mint = pending_mint.into_iter().map(|(key, words)| (key, words)).collect();

        Self {
            tokens,
            owners,
            token_approvals,
            config,
            nonce,
            collection_owner,
            permission_to_mint,
            pending_mint,
            total_number_of_tokens,
            waiting_time_sec
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
