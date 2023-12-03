#![no_std]

use composable_nft_io::{
    ComposableNftAction, ComposableNftEvent, ComposableNftError, ComposableNftInit, ComposableNftState, Config, Nft,
    NftId, StateQuery, StateReply,
};
use gstd::{
    collections::{HashMap, HashSet},
    debug, msg,
    prelude::*,
    ActorId,
};

#[derive(Debug)]
struct ComposableNftContract {
    pub tokens: HashMap<NftId, Nft>,
    pub owners: HashMap<ActorId, HashSet<NftId>>,
    pub restriction_mint: HashMap<ActorId, u32>,
    pub token_approvals: HashMap<NftId, ActorId>,
    pub config: Config,
    pub nonce: NftId,
    pub img_links: Vec<Vec<String>>,
    pub combinations: HashSet<Vec<u8>>,
    pub admins: Vec<ActorId>,
    pub number_combination: u64,
}
static mut NFT_CONTRACT: Option<ComposableNftContract> = None;

impl ComposableNftContract {
    fn add_admin(&mut self, new_admin: &ActorId) -> Result<ComposableNftEvent, ComposableNftError> {
        self.check_admin()?;
        self.admins.push(*new_admin);
        Ok(ComposableNftEvent::AdminAdded)
    }

    fn mint(&mut self, combination: Vec<u8>) -> Result<ComposableNftEvent, ComposableNftError> {
        let msg_src = msg::source();
        self.check_combination(&combination)?;
        self.check_limit()?;

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

        let media_url: Vec<String> = combination
            .iter()
            .enumerate()
            .map(|(index, &comb_value)| self.img_links[index][comb_value as usize].clone())
            .collect();

        self.tokens.insert(
            self.nonce,
            Nft {
                owner: msg_src,
                name,
                description: self.config.description.clone(),
                media_url: media_url.clone(),
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
            return Err(ComposableNftError::Error("Math overflow.".to_owned()));
        };
        self.nonce = next_nft_nonce;

        let mut current_combination = Vec::with_capacity(combination.len());
        current_combination.extend_from_slice(&combination);
        self.combinations.insert(current_combination);

        Ok(
            ComposableNftEvent::Minted {
                owner: msg_src,
                token_id: next_nft_nonce,
                media_url,
                attrib_url: "".to_string(),
            }
        )
    }
    fn transfer_from(
        &mut self,
        from: &ActorId,
        to: &ActorId,
        token_id: NftId,
    ) -> Result<ComposableNftEvent, ComposableNftError> {
        self.can_transfer(from, to, &token_id)?;

        let nft = self
            .tokens
            .get_mut(&token_id)
            .expect("ComposableNftToken: token does not exist");

        nft.owner = *to;

        if let Some(tokens) = self.owners.get_mut(from) {
            tokens.retain(|&token| token != token_id);
            if tokens.is_empty() {
                self.owners.remove(from);
            }
        } else {
            return Err(ComposableNftError::Error(
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

        Ok(ComposableNftEvent::Transferred {
            owner: *from,
            recipient: *to,
            token_id,
        })
    }

    fn approve(&mut self, to: &ActorId, token_id: NftId) -> Result<ComposableNftEvent, ComposableNftError> {
        self.can_approve(&token_id)?;
        self.token_approvals.insert(token_id, *to);

        Ok(ComposableNftEvent::Approved {
            account: *to,
            token_id,
        })
    }

    fn revoke_approve(&mut self, token_id: NftId) -> Result<ComposableNftEvent, ComposableNftError> {
        self.can_approve(&token_id)?;
        let res = self.token_approvals.remove(&token_id);
        if res.is_none(){
            return Err(ComposableNftError::Error(
                "No approve has been issued to this token".to_owned(),
            ));
        }
        Ok(ComposableNftEvent::ApprovalRevoked { token_id })
    }

    fn burn(&mut self, token_id: NftId) -> Result<ComposableNftEvent, ComposableNftError> {
        self.can_burn(&token_id)?;
        let nft = self.tokens.remove(&token_id).expect("Can't be None");
        if let Some(tokens) = self.owners.get_mut(&nft.owner) {
            if tokens.remove(&token_id) {
                return Err(ComposableNftError::Error(
                    "Fatal: owner does not contain nft id.".to_owned(),
                ));
            }
        } else {
            return Err(ComposableNftError::Error(
                "Fatal: owner does not contain list.".to_owned(),
            ));
        }

        self.token_approvals.remove(&token_id);

        Ok(ComposableNftEvent::Burnt { token_id })
    }
    fn change_config(&mut self, user: &ActorId, tokens_limit: Option<u64>) -> Result<ComposableNftEvent, ComposableNftError> {
        if let Some(limit) = tokens_limit {
            if limit <= self.nonce {
                return Err(ComposableNftError::Error(format!(
                    "The specified limit ({}) is less than or equal to the current nonce value ({})",
                    limit,
                    self.nonce
                )));
            }
            if limit > self.number_combination {
                return Err(ComposableNftError::Error(
                    "Exceeds the number of possible combinations".to_owned(),
                ));
            }
        }

        if !self.admins.contains(user) {
            return Err(ComposableNftError::Error("Only admin can send this message".to_owned()));
        }

        self.config.tokens_limit = tokens_limit;

        Ok(ComposableNftEvent::ConfigChanged)
        
    }
    fn is_approved_to(&self, to: &ActorId, token_id: NftId) -> Result<ComposableNftEvent, ComposableNftError> {
        let approval = self.token_approvals.get(&token_id);
        if let Some(approve_acc) = approval {
            let is_approved = approve_acc == to;
            Ok(ComposableNftEvent::IsApproved {
                to: *to,
                token_id,
                approved: is_approved,
            })
        } else {
            Err(ComposableNftError::Error(
                "NonFungibleToken: token has no approvals".to_owned(),
            ))
        }
    }
    fn owner(&self, token_id: NftId) -> Result<ComposableNftEvent, ComposableNftError> {
        let nft = self.tokens.get(&token_id);
        if let Some(nft) = nft {
            return Ok(ComposableNftEvent::Owner {
                owner: nft.owner,
                token_id,
            });
        }
        Err(ComposableNftError::Error(
            "NonFungibleToken: token does not exist".to_owned(),
        ))
    }
    fn is_sellable(&self) -> Result<ComposableNftEvent, ComposableNftError> {
        Ok(ComposableNftEvent::IsSellable(self.config.sellable))
    }
    fn can_approve(&self, token_id: &NftId) -> Result<(), ComposableNftError> {
        if !self.config.approvable {
            return Err(ComposableNftError::Error("Nft is not approvable.".to_owned()));
        }
        if self.token_approvals.contains_key(token_id) {
            return Err(ComposableNftError::Error(
                "Approve has already been issued".to_owned(),
            ));
        }
        if let Some(nft_info) = self.tokens.get(token_id) {
            if nft_info.owner != msg::source() {
                return Err(ComposableNftError::Error(
                    "Only nft owner can send this message".to_owned(),
                ));
            }
        } else {
            return Err(ComposableNftError::Error(
                "This nft id hasn't come out yet".to_owned(),
            ));
        }

        Ok(())
    }
    fn check_admin(&self) -> Result<(), ComposableNftError> {
        if !self.admins.contains(&msg::source()) {
            return Err(ComposableNftError::Error(
                "Only admin can send this message".to_owned(),
            ));
        }
        Ok(())
    }
    fn check_combination(&self, combination: &Vec<u8>) -> Result<(), ComposableNftError> {
        if self.combinations.contains(combination) {
            return Err(ComposableNftError::Error("This combination already exists".to_owned()));
        }
        if combination.len() != self.img_links.len() {
            return Err(ComposableNftError::Error(
                "Incorrectly entered combination: wrong combination length".to_owned(),
            ));
        }
        if combination
            .iter()
            .zip(self.img_links.iter())
            .any(|(comb_value, inner_vec)| *comb_value >= inner_vec.len() as u8)
        {
            return Err(ComposableNftError::Error(
                "Incorrectly entered combination: out of bounds".to_owned(),
            ));
        }
        Ok(())
    }
    fn check_limit(&self) -> Result<(), ComposableNftError> {
        let msg_src = msg::source();
        if let Some(limit) = self.config.tokens_limit {
            if self.nonce >= limit {
                return Err(ComposableNftError::Error("All tokens are minted.".to_owned()));
            }
        } else {
            if self.nonce >= self.number_combination {
                return Err(ComposableNftError::Error("All tokens are minted.".to_owned()));
            }
        }

        if let Some(limit) = self.config.mint_limit {
            if let Some(number_tokens) = self.restriction_mint.get(&msg_src) {
                if number_tokens >= &limit && !self.admins.contains(&msg_src) {
                    return Err(ComposableNftError::Error("You've exhausted your limit.".to_owned()));
                }
            }
        }
        Ok(())
    }
    fn check_approve(&self, user: &ActorId, token_id: &NftId) -> Result<(), ComposableNftError> {
        if let Some(approved_account) = self.token_approvals.get(token_id) {
            if approved_account != user {
                return Err(ComposableNftError::Error(
                    "Caller is not approved to perform transfer.".to_owned(),
                ));
            }
        } else {
            return Err(ComposableNftError::Error(
                "Target token_approvals is empty.".to_owned(),
            ));
        }
        Ok(())
    }

    fn can_transfer(&self, from: &ActorId, to: &ActorId, token_id: &NftId) -> Result<(), ComposableNftError> {
        if !self.config.transferable {
            return Err(ComposableNftError::Error("Nft is not transferable.".to_owned()));
        }

        let nft = self.tokens.get(token_id);

        if let Some(nft) = nft {
            let owner = nft.owner;
            if owner != *from {
                return Err(ComposableNftError::Error(
                    "ComposableNftToken: access denied".to_owned(),
                ));
            }
            let msg_src = msg::source();
            if owner != msg_src {
                self.check_approve(&msg_src, token_id)?;
            }
        } else {
            return Err(ComposableNftError::Error(
                "ComposableNftToken: token does not exist".to_owned(),
            ));
        }

        if from == to {
            return Err(ComposableNftError::Error("Self transfer is not allowed.".to_owned()));
        }
        Ok(())
    }
    fn can_burn(&self, token_id: &NftId) -> Result<(), ComposableNftError> {
        if !self.config.burnable {
            return Err(ComposableNftError::Error("Nft is not burnable.".to_owned()));
        }
        if let Some(nft_info) = self.tokens.get(token_id) {
            if nft_info.owner != msg::source() {
                return Err(ComposableNftError::Error(
                    "Only nft owner can send this message".to_owned(),
                ));
            }
        } else {
            return Err(ComposableNftError::Error(
                "This nft id hasn't come out yet".to_owned(),
            ));
        }

        Ok(())
    }
}

#[no_mangle]
extern "C" fn init() {
    let ComposableNftInit {
        owner,
        config,
        img_links,
    } = msg::load().expect("Unable to decode `ComposableNftInit`.");

    debug!("INIT COMPOSABLE NFT");
    assert!(
        config.mint_limit.map(|limit| limit > 0).unwrap_or(true),
        "The mint limit must be greater than zero"
    );
    assert!(
        config.tokens_limit.map(|limit| limit > 0).unwrap_or(true),
        "The tokens limit must be greater than zero"
    );

    let number_combination: u64 = img_links
        .iter()
        .map(|inner_vec| inner_vec.len() as u64)
        .product();

    assert!(
        config
            .tokens_limit
            .map(|limit| limit <= number_combination)
            .unwrap_or(true),
        "The tokens limit must be greater than zero"
    );

    unsafe {
        NFT_CONTRACT = Some(ComposableNftContract {
            tokens: HashMap::new(),
            owners: HashMap::new(),
            token_approvals: HashMap::new(),
            restriction_mint: HashMap::new(),
            config,
            nonce: 0,
            img_links,
            combinations: HashSet::new(),
            admins: vec![owner],
            number_combination,
        })
    };
    msg::reply(ComposableNftEvent::Initialized, 0)
        .expect("Error during replying with `ComposableNftEvent::Initialized`");
}

#[no_mangle]
extern "C" fn handle() {
    let action: ComposableNftAction = msg::load().expect("Could not load `ComposableNftAction`.");
    let nft_contract: &mut ComposableNftContract = unsafe {
        NFT_CONTRACT
            .as_mut()
            .expect("Unexpected uninitialized `ComposableNftContract`.")
    };

    let user = msg::source();

    let result = match action {
        ComposableNftAction::AddAdmin { new_admin } => nft_contract.add_admin(&new_admin),
        ComposableNftAction::Mint { combination } => nft_contract.mint(combination),
        ComposableNftAction::TransferFrom { from, to, token_id } => {
            nft_contract.transfer_from(&from, &to, token_id)
        }
        ComposableNftAction::Transfer { to, token_id } => {
            nft_contract.transfer_from(&user, &to, token_id)
        }
        ComposableNftAction::Approve { to, token_id } => nft_contract.approve(&to, token_id),
        ComposableNftAction::RevokeApproval { token_id } => {
            nft_contract.revoke_approve(token_id)
        }
        ComposableNftAction::Burn { token_id } => nft_contract.burn(token_id),
        ComposableNftAction::ChangeConfig { tokens_limit } => {
            nft_contract.change_config(&user, tokens_limit)
        }
        ComposableNftAction::IsApproved { to, token_id } => nft_contract.is_approved_to(&to, token_id),
        ComposableNftAction::Owner { token_id } => nft_contract.owner(token_id),
        ComposableNftAction::IsSellable => nft_contract.is_sellable(),
    };

    msg::reply(result, 0).expect("Failed to encode or reply with `StudentNftEvent`.");
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
            let nft_state: ComposableNftState = nft.into();
            msg::reply(StateReply::All(nft_state), 0).expect("Unable to share state");
        }
    }
}

impl From<ComposableNftContract> for ComposableNftState {
    fn from(value: ComposableNftContract) -> Self {
        let ComposableNftContract {
            tokens,
            owners,
            token_approvals,
            config,
            nonce,
            admins,
            img_links,
            restriction_mint,
            number_combination,
            ..
            // combinations,
            // number_combination
        } = value;

        let tokens = tokens
            .iter()
            .map(|(nft_id, nft)| (*nft_id, nft.clone()))
            .collect();
        let owners = owners
            .iter()
            .map(|(k, v)| (*k, v.iter().copied().collect()))
            .collect();
        let token_approvals = token_approvals
            .iter()
            .map(|(nft_id, actor_id)| (*nft_id, *actor_id))
            .collect();
        let restriction_mint = restriction_mint
            .iter()
            .map(|(id, number)| (*id, number.clone()))
            .collect();

        Self {
            tokens,
            owners,
            token_approvals,
            config,
            nonce,
            img_links,
            admins,
            restriction_mint,
            number_combination,
        }
    }
}
