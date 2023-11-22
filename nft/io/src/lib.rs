#![no_std]

use gmeta::{In, InOut, Metadata};
use gstd::{prelude::*, ActorId};
pub type NftId = u128;

pub struct ContractMetadata;

impl Metadata for ContractMetadata {
    type Init = In<NftInit>;
    type Handle = InOut<NftAction, NftEvent>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    type State = InOut<StateQuery, StateReply>;
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct NftInit {
    pub owner: ActorId,
    pub config: Config,
    pub img_links: Vec<(String, u128)>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct Config {
    pub name: String,
    pub description: String,
    pub collection_img: String,
    pub mint_limit: Option<u128>,
    pub transferable: bool,
    pub approvable: bool,
    pub burnable: bool,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum NftAction {
    AddAdmin {
        new_admin: ActorId,
    },
    Mint,
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
    Expand {
        additional_links: Vec<(String, u128)>,
    },
    ChangeConfig {
        config: Config,
    },
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum NftEvent {
    Initialized,
    AdminAdded,
    Minted {
        owner: ActorId,
        token_id: NftId,
        media_url: String,
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
    Expanded {
        additional_links: Vec<(String, u128)>,
    },
    ConfigChanged {
        config: Config,
    },
    Error(String),
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct NftState {
    pub tokens: Vec<(NftId, Nft)>,
    pub owners: Vec<(ActorId, Vec<NftId>)>,
    pub approvals: Vec<(NftId, ActorId)>,
    pub config: Config,
    pub nonce: NftId,
    pub img_links: Vec<(String, u128)>,
    pub admins: Vec<ActorId>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct Nft {
    pub owner: ActorId,
    pub name: String,
    pub description: String,
    pub media_url: String,
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
    All(NftState),
}
