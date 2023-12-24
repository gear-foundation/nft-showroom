#![no_std]

use gmeta::{In, InOut, Metadata};
use gstd::{prelude::*, ActorId};

pub type NftId = u64;

pub struct ContractMetadata;

impl Metadata for ContractMetadata {
    type Init = In<ComposableNftInit>;
    type Handle = InOut<ComposableNftAction, ComposableNftEvent>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    type State = InOut<StateQuery, StateReply>;
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct ComposableNftInit {
    pub owner: ActorId,
    pub config: Config,
    pub img_links: Vec<Vec<String>>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct Config {
    pub name: String,
    pub description: String,
    pub collection_tags: Vec<String>,
    pub collection_img: String,
    pub collection_logo: String,
    pub user_mint_limit: Option<u32>,
    pub tokens_limit: Option<u64>,
    pub additional_links: Option<AdditionalLinks>,
    pub royalty: u16,
    pub payment_for_mint: u128,
    pub transferable: Option<u64>,
    pub sellable: Option<u64>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct AdditionalLinks {
    pub external_url: Option<String>,
    pub telegram: Option<String>,
    pub xcom: Option<String>,
    pub medium: Option<String>,
    pub discord: Option<String>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum ComposableNftAction {
    Transfer {
        to: ActorId,
        token_id: NftId,
    },
    TransferFrom {
        from: ActorId,
        to: ActorId,
        token_id: NftId,
    },
    GetTokenInfo {
        token_id: NftId,
    },
    CanDelete,
    Mint {
        combination: Vec<u8>,
    },
    Approve {
        to: ActorId,
        token_id: NftId,
    },
    RevokeApproval {
        token_id: NftId,
    },
    ChangeConfig {
        config: Config,
    },
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum ComposableNftEvent {
    Transferred {
        owner: ActorId,
        recipient: ActorId,
        token_id: NftId,
    },
    TokenInfoReceived {
        token_owner: ActorId,
        approval: Option<ActorId>,
        sellable: bool,
        collection_owner: ActorId,
        royalty: u16,
    },
    CanDelete(bool),
    Initialized {
        config: Config,
    },
    Minted {
        token_id: NftId,
        nft_data: Nft,
    },
    Approved {
        account: ActorId,
        token_id: NftId,
    },
    ApprovalRevoked {
        token_id: NftId,
    },
    ConfigChanged {
        config: Config,
    },
}
#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct ComposableNftError(pub String);

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct ComposableNftState {
    pub tokens: Vec<(NftId, Nft)>,
    pub owners: Vec<(ActorId, Vec<NftId>)>,
    pub token_approvals: Vec<(NftId, ActorId)>,
    pub config: Config,
    pub nonce: NftId,
    pub img_links: Vec<Vec<String>>,
    pub collection_owner: ActorId,
    pub restriction_mint: Vec<(ActorId, u32)>,
    pub number_combination: u64,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct Nft {
    pub owner: ActorId,
    pub name: String,
    pub description: String,
    pub metadata: Vec<String>,
    pub media_url: Vec<String>,
    pub mint_time: u64,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum StateQuery {
    Name,
    Description,
    Config,
    All,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum StateReply {
    Name(String),
    Description(String),
    Config(Config),
    All(ComposableNftState),
}
