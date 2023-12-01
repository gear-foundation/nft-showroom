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
    pub collection_img: String,
    pub tokens_limit: Option<u64>,
    pub mint_limit: Option<u32>,
    pub transferable: bool,
    pub approvable: bool,
    pub burnable: bool,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum ComposableNftAction {
    AddAdmin {
        new_admin: ActorId,
    },
    Mint {combination: Vec<u8>},
    TransferFrom {
        from: ActorId,
        to: ActorId,
        token_id: NftId,
    },
    Transfer {
        to: ActorId,
        token_id: NftId,
    },
    Approve {
        to: ActorId,
        token_id: NftId,
    },
    RevokeApproval {
        token_id: NftId,
    },
    Burn {
        token_id: NftId,
    },
    ChangeConfig {
        tokens_limit: Option<u64>,
    },
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum ComposableNftEvent {
    Initialized,
    AdminAdded,
    Minted {
        owner: ActorId,
        token_id: NftId,
        media_url: Vec<String>,
        attrib_url: String,
    },
    Transferred {
        owner: ActorId,
        recipient: ActorId,
        token_id: NftId,
    },
    Burnt {
        token_id: NftId,
    },
    Approved {
        account: ActorId,
        token_id: NftId,
    },
    ApprovalRevoked {
        token_id: NftId,
    },
    ConfigChanged,
    Error(String),
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct ComposableNftState {
    pub tokens: Vec<(NftId, Nft)>,
    pub owners: Vec<(ActorId, Vec<NftId>)>,
    pub approvals: Vec<(NftId, ActorId)>,
    pub config: Config,
    pub nonce: NftId,
    pub img_links: Vec<Vec<String>>,
    pub admins: Vec<ActorId>,
    pub restriction_mint: Vec<(ActorId, u32)>,
    pub number_combination: u64,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct Nft {
    pub owner: ActorId,
    pub name: String,
    pub description: String,
    pub media_url: Vec<String>,
    pub attrib_url: String,
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
