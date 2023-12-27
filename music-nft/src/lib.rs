#![no_std]
use gstd::{
    collections::{HashMap, HashSet},
    debug, exec, msg,
    prelude::*,
    ActorId,
};
use music_nft_io::*;

#[derive(Debug)]
struct NftContract {
    pub tokens: HashMap<NftId, Nft>,
    pub owners: HashMap<ActorId, HashSet<NftId>>,
    pub restriction_mint: HashMap<ActorId, u32>, // made in order to track the number of mint nft
    pub token_approvals: HashMap<NftId, ActorId>,
    pub config: Config,
    pub nonce: NftId,
    pub nft_data: Vec<(Links, ImageData)>,
    pub collection_owner: ActorId,
}
static mut NFT_CONTRACT: Option<NftContract> = None;

impl NftContract {
    fn mint(&mut self) -> Result<MusicNftEvent, MusicNftError> {
        let msg_src = msg::source();
        self.check_available_amount_of_tokens()?;
        self.check_mint_limit(&msg_src)?;
        let Some(next_nft_nonce) = self.nonce.checked_add(1) else {
            return Err(MusicNftError("Math overflow.".to_owned()));
        };
        self.payment_for_mint()?;

        let rand_index = get_random_value(self.nft_data.len() as u64);
        let music_link: String;
        let mut img_link = self.config.collection_logo.clone();
        let mut token_description = self.config.description.clone();
        let token_id = self.nonce;

        if let Some((links, img_info)) = self.nft_data.get_mut(rand_index as usize) {
            if let Some(limit) = img_info.limit_copies.as_mut() {
                *limit -= 1;
            }
            music_link = links.music_link.clone();

            if let Some(description) = &img_info.description {
                token_description = description.clone();
            }
            if let Some(image) = links.img_link.clone() {
                img_link = image;
            }

            if let Some(auto_changing_rules) = &img_info.auto_changing_rules {
                auto_changing_rules
                    .iter()
                    .for_each(|(trigger_time, auto_action)| {
                        let action = match auto_action {
                            Action::ChangeImg(img_link) => MusicNftAction::ChangeImg {
                                token_id,
                                img_link: img_link.to_string(),
                            },
                            Action::AddMeta(metadata) => MusicNftAction::AddMetadata {
                                token_id,
                                metadata: metadata.to_string(),
                            },
                        };
                        msg::send_with_gas_delayed(
                            exec::program_id(),
                            action,
                            GAS_AUTO_CHANGING,
                            0,
                            *trigger_time / BLOCK_DURATION_IN_SECS,
                        )
                        .expect("Error in sending a delayed message `NftAction`");
                    });
            }

            if let Some(0) = img_info.limit_copies {
                self.nft_data.remove(rand_index as usize);
            }
        } else {
            return Err(MusicNftError("Error with getting a random nft".to_owned()));
        }

        self.owners
            .entry(msg_src)
            .and_modify(|ids| {
                ids.insert(token_id);
            })
            .or_insert_with(|| HashSet::from([token_id]));

        let name = format!("{} - {}", self.config.name, token_id);
        let nft_data = Nft {
            owner: msg_src,
            name,
            description: token_description,
            metadata: vec![],
            img_link: img_link.clone(),
            music_link: music_link.clone(),
            mint_time: exec::block_timestamp(),
        };

        self.nonce = next_nft_nonce;
        self.tokens.insert(token_id, nft_data.clone());
        self.restriction_mint
            .entry(msg_src)
            .and_modify(|ids| {
                *ids += 1;
            })
            .or_insert(1);

        Ok(MusicNftEvent::Minted { token_id, nft_data })
    }
    fn transfer_from(
        &mut self,
        from: &ActorId,
        to: &ActorId,
        token_id: NftId,
    ) -> Result<MusicNftEvent, MusicNftError> {
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
            return Err(MusicNftError(
                "Fatal: owner does not contain nft id.".to_owned(),
            ));
        }

        self.owners
            .entry(*to)
            .and_modify(|ids| {
                ids.insert(token_id);
            })
            .or_insert_with(|| HashSet::from([token_id]));

        self.token_approvals.remove(&token_id);

        Ok(MusicNftEvent::Transferred {
            owner: *from,
            recipient: *to,
            token_id,
        })
    }
    fn approve(&mut self, to: &ActorId, token_id: NftId) -> Result<MusicNftEvent, MusicNftError> {
        self.can_approve(&token_id)?;
        self.token_approvals.insert(token_id, *to);

        Ok(MusicNftEvent::Approved {
            account: *to,
            token_id,
        })
    }

    fn revoke_approve(&mut self, token_id: NftId) -> Result<MusicNftEvent, MusicNftError> {
        if let Some(nft_info) = self.tokens.get(&token_id) {
            if nft_info.owner != msg::source() {
                return Err(MusicNftError(
                    "Only nft owner can send this message".to_owned(),
                ));
            }
        } else {
            return Err(MusicNftError("This nft id hasn't come out yet".to_owned()));
        }
        let res = self.token_approvals.remove(&token_id);
        if res.is_none() {
            return Err(MusicNftError(
                "No approve has been issued to this token".to_owned(),
            ));
        }
        Ok(MusicNftEvent::ApprovalRevoked { token_id })
    }

    fn get_token_info(&self, token_id: NftId) -> Result<MusicNftEvent, MusicNftError> {
        let nft = self.tokens.get(&token_id);
        let (token_owner, can_sell) = if let Some(nft) = nft {
            let can_sell = if let Some(time) = self.config.sellable {
                exec::block_timestamp() >= nft.mint_time + time
            } else {
                false
            };
            (nft.owner, can_sell)
        } else {
            return Err(MusicNftError(
                "NonFungibleToken: token does not exist".to_owned(),
            ));
        };
        let approval = self.token_approvals.get(&token_id).copied();

        Ok(MusicNftEvent::TokenInfoReceived {
            token_owner,
            approval,
            sellable: can_sell,
            collection_owner: self.collection_owner,
            royalty: self.config.royalty,
        })
    }
    fn expand(
        &mut self,
        additional_links: Vec<(Links, ImageData)>,
    ) -> Result<MusicNftEvent, MusicNftError> {
        self.check_collection_owner()?;

        if additional_links
            .iter()
            .any(|(_, img_data)| img_data.limit_copies.map_or(false, |limit| limit == 0))
        {
            return Err(MusicNftError(
                "Limit of copies value is equal to 0".to_owned(),
            ));
        }

        self.nft_data.extend(additional_links.clone());

        Ok(MusicNftEvent::Expanded { additional_links })
    }

    fn change_config(&mut self, config: Config) -> Result<MusicNftEvent, MusicNftError> {
        self.check_collection_owner()?;

        if !self.tokens.is_empty() {
            return Err(MusicNftError(
                "The collection configuration can no more be changed".to_owned(),
            ));
        }

        // made 10_000 so you can enter hundredths of a percent.
        if config.royalty > 10_000 {
            return Err(MusicNftError(
                "Royalty percent must be less than 100%".to_owned(),
            ));
        }

        if config.transferable.is_none() && config.sellable.is_some() {
            return Err(MusicNftError("Tokens must be transferable".to_owned()));
        }

        if let Some(limit) = config.user_mint_limit {
            if limit == 0 {
                return Err(MusicNftError(
                    "The mint limit must be greater than zero".to_owned(),
                ));
            }
        }
        self.config = config.clone();
        Ok(MusicNftEvent::ConfigChanged { config })
    }

    fn change_image(
        &mut self,
        token_id: NftId,
        img_link: String,
    ) -> Result<MusicNftEvent, MusicNftError> {
        if exec::program_id() != msg::source() {
            return Err(MusicNftError(
                "Only program can send this message".to_owned(),
            ));
        }
        let nft = self
            .tokens
            .get_mut(&token_id)
            .expect("Token does not exist");

        nft.img_link = img_link.clone();
        msg::send(
            nft.owner,
            MusicNftEvent::ImageChanged {
                token_id,
                img_link: img_link.clone(),
            },
            0,
        )
        .expect("Error in sending MusicNftEvent::ImageChanged");
        Ok(MusicNftEvent::ImageChanged { token_id, img_link })
    }

    fn add_metadata(
        &mut self,
        token_id: NftId,
        metadata: String,
    ) -> Result<MusicNftEvent, MusicNftError> {
        if exec::program_id() != msg::source() {
            return Err(MusicNftError(
                "Only program can send this message".to_owned(),
            ));
        }
        let nft = self
            .tokens
            .get_mut(&token_id)
            .expect("Token does not exist");

        nft.metadata.push(metadata.clone());
        msg::send(
            nft.owner,
            MusicNftEvent::MetadataAdded {
                token_id,
                metadata: metadata.clone(),
            },
            0,
        )
        .expect("Error in sending MusicNftEvent::MetadataAdded");
        Ok(MusicNftEvent::MetadataAdded { token_id, metadata })
    }

    fn can_delete(&self) -> Result<MusicNftEvent, MusicNftError> {
        Ok(MusicNftEvent::CanDelete(self.tokens.is_empty()))
    }

    fn check_collection_owner(&self) -> Result<(), MusicNftError> {
        if self.collection_owner != msg::source() {
            return Err(MusicNftError(
                "Only collection owner can send this message".to_owned(),
            ));
        }
        Ok(())
    }

    fn check_available_amount_of_tokens(&self) -> Result<(), MusicNftError> {
        if self.nft_data.is_empty() {
            return Err(MusicNftError("All tokens are minted.".to_owned()));
        }
        Ok(())
    }
    fn check_mint_limit(&self, user: &ActorId) -> Result<(), MusicNftError> {
        if let Some(limit) = self.config.user_mint_limit {
            if let Some(number_tokens) = self.restriction_mint.get(user) {
                if number_tokens >= &limit && self.collection_owner != *user {
                    return Err(MusicNftError("You've exhausted your limit.".to_owned()));
                }
            }
        }
        Ok(())
    }
    fn can_approve(&self, token_id: &NftId) -> Result<(), MusicNftError> {
        if self.token_approvals.contains_key(token_id) {
            return Err(MusicNftError("Approve has already been issued".to_owned()));
        }
        if let Some(nft_info) = self.tokens.get(token_id) {
            if nft_info.owner != msg::source() {
                return Err(MusicNftError(
                    "Only nft owner can send this message".to_owned(),
                ));
            }
        } else {
            return Err(MusicNftError("This nft id hasn't come out yet".to_owned()));
        }

        Ok(())
    }
    fn payment_for_mint(&self) -> Result<(), MusicNftError> {
        if self.config.payment_for_mint != 0 {
            if msg::value() != self.config.payment_for_mint {
                return Err(MusicNftError("Incorrectly entered mint fee.".to_owned()));
            }
            // use send_with_gas to transfer the value directly to the balance, not to the mailbox.
            msg::send_with_gas(self.collection_owner, "", 0, self.config.payment_for_mint)
                .expect("Error in sending value");
        }

        Ok(())
    }
    fn check_approve(&self, user: &ActorId, token_id: &NftId) -> Result<(), MusicNftError> {
        if let Some(approved_account) = self.token_approvals.get(token_id) {
            if approved_account != user {
                return Err(MusicNftError(
                    "Caller is not approved to perform transfer.".to_owned(),
                ));
            }
        } else {
            return Err(MusicNftError("Target token_approvals is empty.".to_owned()));
        }
        Ok(())
    }

    fn can_transfer(
        &self,
        from: &ActorId,
        to: &ActorId,
        token_id: &NftId,
    ) -> Result<(), MusicNftError> {
        if let Some(nft) = self.tokens.get(token_id) {
            let owner = nft.owner;
            if owner != *from {
                return Err(MusicNftError("NonFungibleToken: access denied".to_owned()));
            }
            let msg_src = msg::source();
            if owner != msg_src {
                self.check_approve(&msg_src, token_id)?;
            }
            if let Some(time) = self.config.transferable {
                if exec::block_timestamp() < nft.mint_time + time {
                    return Err(MusicNftError(
                        "NonFungibleToken: transfer will be available after the deadline"
                            .to_owned(),
                    ));
                }
            } else {
                return Err(MusicNftError(
                    "NonFungibleToken: token is not transferable".to_owned(),
                ));
            }
        } else {
            return Err(MusicNftError(
                "NonFungibleToken: token does not exist".to_owned(),
            ));
        }

        if from == to {
            return Err(MusicNftError("Self transfer is not allowed.".to_owned()));
        }
        Ok(())
    }
}

#[no_mangle]
extern "C" fn init() {
    let MusicNftInit {
        collection_owner,
        config,
        nft_data,
    } = msg::load().expect("Unable to decode `MusicNftInit`.");
    debug!("INIT NFT");

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

    // made 10_000 so you can enter hundredths of a percent.
    if config.royalty > 10_000 {
        panic!("Royalty percent must be less than 100%");
    }
    assert!(
        !nft_data.is_empty(),
        "There must be at least one link to create a collection"
    );
    if config.transferable.is_none() && config.sellable.is_some() {
        panic!("Tokens must be transferable");
    }
    if nft_data
        .iter()
        .any(|(_, img_data)| img_data.limit_copies.map_or(false, |limit| limit == 0))
    {
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
            nft_data,
            collection_owner,
        })
    };

    msg::send(
        collection_owner,
        MusicNftEvent::Initialized {
            config: config.clone(),
        },
        0,
    )
    .expect("Error during send to owner `MusicNftEvent::Initialized`");

    msg::reply(
        MusicNftEvent::Initialized {
            config: config.clone(),
        },
        0,
    )
    .expect("Error during a reply `MusicNftEvent::Initialized`");
}

#[no_mangle]
extern "C" fn handle() {
    let action: MusicNftAction = msg::load().expect("Could not load `MusicNftAction`.");
    let nft_contract: &mut NftContract = unsafe {
        NFT_CONTRACT
            .as_mut()
            .expect("Unexpected uninitialized `MusicNftContract`.")
    };

    let result = match action {
        MusicNftAction::Mint => nft_contract.mint(),
        MusicNftAction::TransferFrom { from, to, token_id } => {
            nft_contract.transfer_from(&from, &to, token_id)
        }
        MusicNftAction::Transfer { to, token_id } => {
            nft_contract.transfer_from(&msg::source(), &to, token_id)
        }
        MusicNftAction::Approve { to, token_id } => nft_contract.approve(&to, token_id),
        MusicNftAction::RevokeApproval { token_id } => nft_contract.revoke_approve(token_id),
        MusicNftAction::Expand { additional_links } => nft_contract.expand(additional_links),
        MusicNftAction::ChangeConfig { config } => nft_contract.change_config(config),
        MusicNftAction::ChangeImg { token_id, img_link } => {
            nft_contract.change_image(token_id, img_link)
        }
        MusicNftAction::AddMetadata { token_id, metadata } => {
            nft_contract.add_metadata(token_id, metadata)
        }
        MusicNftAction::GetTokenInfo { token_id } => nft_contract.get_token_info(token_id),
        MusicNftAction::CanDelete => nft_contract.can_delete(),
    };

    msg::reply(result, 0)
        .expect("Failed to encode or reply with `Result<MusicNftEvent, MusicNftError>`.");
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
            nft_data,
            collection_owner,
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
            nft_data,
            collection_owner,
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
