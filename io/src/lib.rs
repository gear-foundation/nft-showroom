#![no_std]
use gmeta::{In, InOut, Metadata};
use gstd::{prelude::*, ActorId, CodeId};

pub struct NftMarketplaceMetadata;
impl Metadata for NftMarketplaceMetadata {
    type Init = In<NftMarketplaceInit>;
    type Handle = InOut<NftMarketplaceAction, NftMarketplaceEvent>;
    type Reply = ();
    type Others = ();
    type Signal = ();
    type State = InOut<StateQuery, StateReply>;
}

#[derive(Encode, Decode, TypeInfo)]
pub struct NftMarketplaceInit {
    pub gas_for_creation: u64,
    pub time_between_create_collections: u64,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum NftMarketplaceAction {
    AddNewCollection {
        code_id: CodeId,
        meta_link: String,
        type_description: String,
    },
    CreateCollection {
        id_collection: u16,
        payload: Vec<u8>,
    },
    SaleNft {
        collection_address: ActorId,
        token_id: u64,
        price: u128,
    },
    CancelSaleNft {
        collection_address: ActorId,
        token_id: u64,
    },
    BuyNft {
        collection_address: ActorId,
        token_id: u64,
    },
    CreateAuction {
        collection_address: ActorId,
        token_id: u64,
        min_price: u128,
        duration_ms: u32,
    },
    AddBid {
        collection_address: ActorId,
        token_id: u64,
    },
    CloseAuction {
        collection_address: ActorId,
        token_id: u64,
    },
    DeleteCollection {
        collection_address: ActorId,
    },
    AddAdmins {
        users: Vec<ActorId>,
    },
    DeleteAdmin {
        user: ActorId,
    },
    UpdateConfig {
        gas_for_creation: Option<u64>,
        time_between_create_collections: Option<u64>,
    },
}

#[derive(Encode, Decode, Debug, TypeInfo)]
pub enum NftMarketplaceEvent {
    NewCollectionAdded {
        code_id: CodeId,
        meta_link: String,
        description: String,
        id_collection: u16,
    },
    CollectionCreated {
        id_collection: u16,
        collection_address: ActorId,
    },
    SaleNft {
        collection_address: ActorId,
        token_id: u64,
        price: u128,
        owner: ActorId,
    },
    SaleNftCanceled {
        collection_address: ActorId,
        token_id: u64,
    },
    NftSold {
        current_owner: ActorId,
        token_id: u64,
        price: u128,
    },
    AuctionCreated {
        collection_address: ActorId,
        token_id: u64,
        min_price: u128,
        duration_ms: u32,
    },
    AuctionClosed {
        collection_address: ActorId,
        token_id: u64,
        price: u128,
        current_owner: ActorId,
    },
    BidAdded {
        collection_address: ActorId,
        token_id: u64,
    },
    CollectionDeleted {
        collection_address: ActorId,
    },
    AdminsAdded {
        users: Vec<ActorId>,
    },
    AdminDeleted {
        user: ActorId,
    },
    ConfigUpdated {
        gas_for_creation: Option<u64>,
        time_between_create_collections: Option<u64>,
    },
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub struct NftMarketplaceError(pub String);

#[derive(Encode, Decode, TypeInfo)]
pub enum StateQuery {
    All,
    Admins,
    CollectionsInfo,
    Config,
    AllCollections,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum StateReply {
    All(State),
    Admins(Vec<ActorId>),
    CollectionsInfo(Vec<(u16, CollectionInfo)>),
    Config(Config),
    AllCollections(Vec<(ActorId, ActorId)>),
}

#[derive(Debug, Encode, Decode, TypeInfo, Clone)]
pub struct State {
    pub admins: Vec<ActorId>,
    pub collection_to_owner: Vec<(ActorId, ActorId)>,
    pub time_creation: Vec<(ActorId, u64)>,
    pub type_collections: Vec<(u16, CollectionInfo)>,
    pub sale: Vec<((ActorId, u64), NftInfoForSale)>,
    pub auction: Vec<((ActorId, u64), Auction)>,
    pub config: Config,
}

#[derive(Debug, Encode, Decode, TypeInfo, Clone)]
pub struct CollectionInfo {
    pub code_id: CodeId,
    pub meta_link: String,
    pub description: String,
}

#[derive(Default, Debug, Encode, Decode, TypeInfo, Clone)]
pub struct Config {
    pub gas_for_creation: u64,
    pub time_between_create_collections: u64,
}

#[derive(Debug, Encode, Decode, TypeInfo, Clone)]
pub struct NftInfoForSale {
    pub price: u128,
    pub owner: ActorId,
}

#[derive(Debug, Encode, Decode, TypeInfo, Clone)]
pub struct Auction {
    pub owner: ActorId,
    pub started_at: u64,
    pub ended_at: u64,
    pub current_price: u128,
    pub current_winner: ActorId,
}
#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum NftAction {
    Transfer {
        to: ActorId,
        token_id: u64,
    },
    TransferFrom {
        from: ActorId,
        to: ActorId,
        token_id: u64,
    },
    GetTokenInfo {
        token_id: u64,
    },
    CanDelete,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum NftEvent {
    Transferred {
        owner: ActorId,
        recipient: ActorId,
        token_id: u64,
    },
    TokenInfoReceived {
        owner: ActorId,
        approval: Option<ActorId>,
        sellable: bool,
    },
    CanDelete(bool),
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum NftError {
    Error(String),
}
