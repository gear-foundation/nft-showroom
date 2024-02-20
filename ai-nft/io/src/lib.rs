#![no_std]

use gmeta::{In, InOut, Metadata};
use gstd::{prelude::*, ActorId};
pub type NftId = u128;
pub type TimeSec = u32;

pub const BLOCK_DURATION_IN_SECS: u32 = 3;
pub const EXISTENTIAL_DEPOSIT: u128 = 10_000_000_000_000;

pub struct ContractMetadata;

impl Metadata for ContractMetadata {
    type Init = In<NftInit>;
    type Handle = InOut<NftAction, Result<NftEvent, NftError>>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    type State = InOut<StateQuery, StateReply>;
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct NftInit {
    pub collection_owner: ActorId,
    pub config: Config,
    pub permission_to_mint: Option<Vec<ActorId>>,
    pub dictionary: Vec<String>,
    pub total_number_of_tokens: Option<u64>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum Action {
    ChangeImg(String),
    AddMeta(String),
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct Config {
    pub name: String,
    pub description: String,
    pub collection_tags: Vec<String>,
    pub collection_banner: String,
    pub collection_logo: String,
    pub user_mint_limit: Option<u32>,
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
pub enum NftAction {
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
    FirstPhaseOfMint,
    SecondPhaseOfMint {
        minter: ActorId,
        personal_id: u32,
        img_link: String,
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
    ChangeImg {
        token_id: NftId,
        img_link: String,
    },
    AddMetadata {
        token_id: NftId,
        metadata: String,
    },
    AddUsersForMint {
        users: Vec<ActorId>,
    },
    DeleteUserForMint {
        user: ActorId,
    },
    LiftRestrictionMint,
    ExpandDictionary(Vec<String>),
    MintPhaseTwoCheck {
        minter: ActorId,
        personal_id: u32,
    },
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum NftEvent {
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
        permission_to_mint: Option<Vec<ActorId>>,
    },
    PhaseOneOfMintDone {
        minter_to_personal_id: (ActorId, u32),
        words: Vec<String>,
    },
    PhaseTwoOfMintDone {
        token_id: NftId,
        nft_data: Nft,
    },
    Approved {
        to: ActorId,
        token_id: NftId,
    },
    ApprovalRevoked {
        token_id: NftId,
    },
    ConfigChanged {
        config: Config,
    },
    ImageChanged {
        token_id: NftId,
        img_link: String,
    },
    MetadataAdded {
        token_id: NftId,
        metadata: String,
    },
    UsersForMintAdded {
        users: Vec<ActorId>,
    },
    UserForMintDeleted {
        user: ActorId,
    },
    LiftRestrictionMint,
    DictionaryExpanded,
    Checked,
}
#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum NftError {
    MathOverflow,
    ErrorGettingRandom,
    TokenDoesNotExist,
    AllTokensMinted,
    OwnerDoesNotHaveNft,
    AccessDenied,
    NoApproval,
    ThereIsApproval,
    LimitIsZero,
    ConfigCannotBeChanged,
    WrongRoyalty,
    NotTransferable,
    UserRestrictionCannotBeChanged,
    NoListOfRestriction,
    ThereIsNoSuchUser,
    ExhaustedLimit,
    WrongValue,
    NotOnPendingList,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct NftState {
    pub tokens: Vec<(NftId, Nft)>,
    pub owners: Vec<(ActorId, Vec<NftId>)>,
    pub token_approvals: Vec<(NftId, ActorId)>,
    pub config: Config,
    pub nonce: NftId,
    pub collection_owner: ActorId,
    pub permission_to_mint: Option<Vec<ActorId>>,
    pub pending_mint: Vec<((ActorId, u32), Vec<String>)>,
    pub total_number_of_tokens: Option<u64>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct Nft {
    pub owner: ActorId,
    pub name: String,
    pub description: String,
    pub metadata: Vec<String>,
    pub media_url: String,
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
    All(NftState),
}
