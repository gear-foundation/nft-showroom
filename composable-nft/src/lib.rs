#![no_std]

use composable_nft_io::{
    ComposableNftInit, Config, Nft, ComposableNftAction, ComposableNftEvent, NftId, ComposableNftState, StateQuery, StateReply,
};
use gstd::{
    collections::{HashMap, HashSet},
    debug, msg,
    prelude::*,
    ActorId
};

#[derive(Debug)]
struct ComposableNftContract {
    pub tokens: HashMap<NftId, Nft>,
    pub owners: HashMap<ActorId, HashSet<NftId>>,
    pub restriction_mint: HashMap<ActorId, u32>,
    pub approvals: HashMap<NftId, ActorId>,
    pub config: Config,
    pub nonce: NftId,
    pub img_links: Vec<Vec<String>>,
    pub combinations: HashSet<Vec<u8>>,
    pub admins: Vec<ActorId>,
    pub number_combination: u64,
}
static mut NFT_CONTRACT: Option<ComposableNftContract> = None;

impl ComposableNftContract {
    fn add_admin(&mut self, new_admin: &ActorId) -> ComposableNftEvent {
        if !self.admins.contains(&msg::source()) {
            return ComposableNftEvent::Error("Only admin can send this message".to_owned());
        }
        self.admins.push(*new_admin);
        ComposableNftEvent::AdminAdded
    }
    fn mint(&mut self, combination: Vec<u8>) -> ComposableNftEvent {
        let msg_src = msg::source();

        if self.combinations.contains(&combination){
            return ComposableNftEvent::Error("This combination already exists".to_owned());
        }
        if combination.len() != self.img_links.len() {
            return ComposableNftEvent::Error("Incorrectly entered combination: wrong combination length".to_owned());
        }
        if combination.iter().zip(self.img_links.iter()).any(|(comb_value, inner_vec)| *comb_value >= inner_vec.len() as u8) {
            return ComposableNftEvent::Error("Incorrectly entered combination: out of bounds".to_owned());
        }
        if let Some(limit) = self.config.tokens_limit{
            if self.nonce >= limit {
                return ComposableNftEvent::Error("All tokens are minted.".to_owned());
            }
        } else {
            if self.nonce >= self.number_combination {
                return ComposableNftEvent::Error("All tokens are minted.".to_owned());
            }
        }

        if let Some(limit) = self.config.mint_limit {
            if let Some(number_tokens) = self.restriction_mint.get(&msg_src) {
                if number_tokens >= &limit && !self.admins.contains(&msg_src) {
                    return ComposableNftEvent::Error("You've exhausted your limit.".to_owned());
                }
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

        let media_url: Vec<String> = combination
            .iter()
            .enumerate()
            .map(|(index, &comb_value)| {
                self.img_links[index][comb_value as usize].clone()
            })
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
            return ComposableNftEvent::Error("Math overflow.".to_owned());
        };
        self.nonce = next_nft_nonce;

        let mut current_combination = Vec::with_capacity(combination.len());
        current_combination.extend_from_slice(&combination);
        self.combinations.insert(current_combination);

        ComposableNftEvent::Minted {
            owner: msg_src,
            token_id: next_nft_nonce,
            media_url,
            attrib_url: "".to_string(),
        }
    }

    fn transfer_from(
        &mut self,
        user: &ActorId,
        from: &ActorId,
        to: &ActorId,
        token_id: NftId,
    ) -> ComposableNftEvent {
        if !self.config.transferable {
            return ComposableNftEvent::Error("Nft is not transferable.".to_owned());
        }
        // 1. Check approve
        if user != from {
            if let Some(approved_account) = self.approvals.get(&token_id) {
                if approved_account != user {
                    return ComposableNftEvent::Error(
                        "Caller is not approved to perform transfer.".to_owned(),
                    );
                }
            } else {
                return ComposableNftEvent::Error("Target approvals is empty.".to_owned());
            }
        }

        if from == to {
            return ComposableNftEvent::Error("Self transfer is not allowed.".to_owned());
        }

        // 2. Check that `from` owns nft by `token_id`
        if let Some(nft) = self.tokens.get_mut(&token_id) {
            if nft.owner == *from {
                // 3. Remove `from` nft id
                if let Some(from_nfts) = self.owners.get_mut(from) {
                    from_nfts.remove(&token_id);
                } else {
                    return ComposableNftEvent::Error("Fatal: owner does not contain nft id.".to_owned());
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

                ComposableNftEvent::Transferred {
                    owner: *from,
                    recipient: *to,
                    token_id,
                }
            } else {
                ComposableNftEvent::Error("Invalid owner.".to_owned())
            }
        } else {
            ComposableNftEvent::Error("Provided nft does not exist.".to_owned())
        }
    }

    fn approve(&mut self, user: &ActorId, to: &ActorId, token_id: NftId) -> ComposableNftEvent {
        if !self.config.approvable {
            return ComposableNftEvent::Error("Nft is not approvable.".to_owned());
        }

        if let Some(nft_info) = self.tokens.get(&token_id) {
            if nft_info.owner == *user {
                if let Some(_approved_account) = self.approvals.get(&token_id) {
                    return ComposableNftEvent::Error("Already have an approved account".to_owned());
                } else {
                    self.approvals.insert(token_id, *to);
                }
            } else {
                return ComposableNftEvent::Error("Only nft owner can send this message".to_owned());
            }
        } else {
            return ComposableNftEvent::Error("This nft id hasn't come out yet".to_owned());
        }

        ComposableNftEvent::Approved {
            account: *to,
            token_id,
        }
    }

    fn revoke_approve(&mut self, user: &ActorId, token_id: NftId) -> ComposableNftEvent {
        if !self.config.approvable {
            return ComposableNftEvent::Error("Nft is not approvable.".to_owned());
        }

        if let Some(nft_info) = self.tokens.get(&token_id) {
            if nft_info.owner == *user {
                if let Some(_approved_account) = self.approvals.get(&token_id) {
                    self.approvals.remove(&token_id);
                } else {
                    return ComposableNftEvent::Error("There are no approved accounts to revoke".to_owned());
                }
            } else {
                return ComposableNftEvent::Error("Only nft owner can send this message".to_owned());
            }
        } else {
            return ComposableNftEvent::Error("This nft id hasn't come out yet".to_owned());
        }

        ComposableNftEvent::ApprovalRevoked { token_id }
    }

    fn burn(&mut self, user: &ActorId, token_id: NftId) -> ComposableNftEvent {
        if !self.config.burnable {
            return ComposableNftEvent::Error("Nft is not burnable.".to_owned());
        }

        if let Some(nft_info) = self.tokens.clone().get(&token_id) {
            if nft_info.owner == *user {
                self.tokens.remove(&token_id).expect("Can't be None");
                let tokens: &mut HashSet<u64> =
                    self.owners.get_mut(&nft_info.owner).expect("Can't be None");
                tokens.remove(&token_id);
                // self.owners.remove(&nft_info.owner).expect("Can't be None");
                self.approvals.remove(&token_id);
            } else {
                return ComposableNftEvent::Error("Only nft owner can send this message".to_owned());
            }
        } else {
            return ComposableNftEvent::Error("This nft id hasn't come out yet".to_owned());
        }

        ComposableNftEvent::Burnt { token_id }
    }
    fn change_config(&mut self, user: &ActorId, tokens_limit: Option<u64>) -> ComposableNftEvent {

        if let Some(limit) = tokens_limit {
            if limit <= self.nonce {
                return ComposableNftEvent::Error(format!(
                    "The specified limit ({}) is less than or equal to the current nonce value ({})",
                    limit,
                    self.nonce
                ));
            }
            if limit > self.number_combination{
                return ComposableNftEvent::Error("Exceeds the number of possible combinations".to_owned());
            }
        }

        if !self.admins.contains(user) {
            return ComposableNftEvent::Error("Only admin can send this message".to_owned());
        }

        self.config.tokens_limit = tokens_limit;

        ComposableNftEvent::ConfigChanged
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
    assert!(config.mint_limit.map(|limit| limit > 0).unwrap_or(true), "The mint limit must be greater than zero");
    assert!(config.tokens_limit.map(|limit| limit > 0).unwrap_or(true), "The tokens limit must be greater than zero");

    let number_combination: u64 = img_links
        .iter()
        .map(|inner_vec| inner_vec.len() as u64)
        .product();

    assert!(config.tokens_limit.map(|limit| limit <= number_combination).unwrap_or(true), "The tokens limit must be greater than zero");
    
    unsafe {
        NFT_CONTRACT = Some(ComposableNftContract {
            tokens: HashMap::new(),
            owners: HashMap::new(),
            approvals: HashMap::new(),
            restriction_mint: HashMap::new(),
            config,
            nonce: 0,
            img_links,
            combinations: HashSet::new(),
            admins: vec![msg::source(), owner],
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
        ComposableNftAction::Mint {combination} => nft_contract.mint(combination),
        ComposableNftAction::TransferFrom { from, to, token_id } => {
            nft_contract.transfer_from(&user, &from, &to, token_id)
        }
        ComposableNftAction::Transfer { to, token_id } => {
            nft_contract.transfer_from(&user, &user, &to, token_id)
        }
        ComposableNftAction::Approve { to, token_id } => nft_contract.approve(&user, &to, token_id),
        ComposableNftAction::RevokeApproval { token_id } => nft_contract.revoke_approve(&user, token_id),
        ComposableNftAction::Burn { token_id } => nft_contract.burn(&user, token_id),
        ComposableNftAction::ChangeConfig { tokens_limit } => nft_contract.change_config(&user, tokens_limit),
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
            approvals,
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
        let approvals = approvals
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
            approvals,
            config,
            nonce,
            img_links,
            admins,
            restriction_mint,
            number_combination
        }
    }
}

