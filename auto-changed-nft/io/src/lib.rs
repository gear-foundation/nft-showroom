#![no_std]

use gmeta::{In, InOut, Metadata};
use gstd::{prelude::*, ActorId};
pub type NftId = u64;

pub struct ContractMetadata;

pub const BLOCK_DURATION_IN_SECS: u32 = 3;

impl Metadata for ContractMetadata {
    type Init = In<AutoNftInit>;
    type Handle = InOut<AutoNftAction, AutoNftEvent>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    type State = InOut<StateQuery, StateReply>;
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct AutoNftInit {
    pub owner: ActorId,
    pub config: Config,
    pub img_links: Vec<(Vec<String>, u32)>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct Config {
    pub name: String,
    pub description: String,
    pub collection_banner: String,
    pub collection_tags: Vec<String>,
    pub user_mint_limit: Option<u32>,
    // pub time_for_change: u32,
    pub time_to_action: Vec<(u32, Action)>,
    pub transferable: bool,
    pub approvable: bool,
    pub burnable: bool,
    pub sellable: bool,
    pub attendable: bool,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum Action {
    ChangeImg,
    // ChangeMeta(String),
    // AddMeta(String),
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum AutoNftAction {
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
        additional_links: Vec<(Vec<String>, u32)>,
    },
    ChangeConfig {
        config: Config,
    },
    AddAdmin {
        new_admin: ActorId,
    },
    ChangeImg {
        token_id: NftId,
    },
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum AutoNftEvent {
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
    Initialized {
        config: Config,
    },
    AdminAdded,
    Minted {
        owner: ActorId,
        token_id: NftId,
        media_url: Vec<String>,
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
        additional_links: Vec<(Vec<String>, u32)>,
    },
    ConfigChanged {
        config: Config,
    },
    ChangeStarted {
        token_id: NftId,
    },
    ImageChanged {
        token_id: NftId,
    },
}
#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct AutoNftError(pub String);

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct AutoNftState {
    pub tokens: Vec<(NftId, Nft)>,
    pub owners: Vec<(ActorId, Vec<NftId>)>,
    pub token_approvals: Vec<(NftId, ActorId)>,
    pub config: Config,
    pub nonce: NftId,
    pub img_links: Vec<(Vec<String>, u32)>,
    pub admins: Vec<ActorId>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct Nft {
    pub owner: ActorId,
    pub name: String,
    pub description: String,
    pub media_url: (u32, Vec<String>), // (number current image, vector of all image)
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
    All(AutoNftState),
}
