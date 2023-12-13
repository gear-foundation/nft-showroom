#![no_std]

use gmeta::{In, InOut, Metadata};
use gstd::{prelude::*, ActorId};
pub type NftId = u64;

pub struct ContractMetadata;

impl Metadata for ContractMetadata {
    type Init = In<MusicNftInit>;
    type Handle = InOut<MusicNftAction, MusicNftEvent>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    type State = InOut<StateQuery, StateReply>;
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct MusicNftInit {
    pub owner: ActorId,
    pub config: Config,
    pub external_links: Vec<(Links, u32)>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct Config {
    pub name: String,
    pub description: String,
    pub collection_img: String,
    pub collection_tags: Vec<String>,
    pub user_mint_limit: Option<u32>,
    pub listening_capabilities: ListenCapability,
    pub transferable: bool,
    pub approvable: bool,
    pub burnable: bool,
    pub sellable: bool,
    pub attendable: bool,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum ListenCapability {
    AvailableFull,
    Demo,
    NotAvailable,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum MusicNftAction {
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
    Mint,
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
        additional_links: Vec<(Links, u32)>,
    },
    ChangeConfig {
        config: Config,
    },
    AddAdmin {
        new_admin: ActorId,
    },
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum MusicNftEvent {
    Transferred {
        owner: ActorId,
        recipient: ActorId,
        token_id: NftId,
    },
    TokenInfoReceived {
        owner: ActorId,
        approval: Option<ActorId>,
        sellable: bool,
    },
    CanDelete(bool),
    Initialized {
        config: Config,
    },
    AdminAdded,
    Minted {
        owner: ActorId,
        token_id: NftId,
        media_url: Links,
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
        additional_links: Vec<(Links, u32)>,
    },
    ConfigChanged {
        config: Config,
    },
}
#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct MusicNftError(pub String);

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct NftState {
    pub tokens: Vec<(NftId, Nft)>,
    pub owners: Vec<(ActorId, Vec<NftId>)>,
    pub token_approvals: Vec<(NftId, ActorId)>,
    pub config: Config,
    pub nonce: NftId,
    pub external_links: Vec<(Links, u32)>,
    pub admins: Vec<ActorId>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct Nft {
    pub owner: ActorId,
    pub name: String,
    pub description: String,
    pub media_url: Links,
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

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct Links {
    pub img_link: String,
    pub music_link: String,
}
