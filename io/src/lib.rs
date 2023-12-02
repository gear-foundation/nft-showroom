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
        description: String,
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
    BuyNft {
        collection_address: ActorId,
        token_id: u64,
    },
    DeleteCollection {
        id_collection: u16,
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
        collection_info: CollectionInfo,
    },
    CollectionCreated {
        collection_address: ActorId,
    },
    SaleNft {
        collection_address: ActorId,
        token_id: u64,
        price: u128,
        owner: ActorId,
    },
    NftSold {
        previous_owner: ActorId,
        current_owner: ActorId,
        token_id: u64,
        price: u128,
    },
    CollectionDeleted {
        id_collection: u16,
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
pub enum NftMarketplaceError {
    Error(String),
}

#[derive(Encode, Decode, TypeInfo)]
pub enum StateQuery {
    All,
    Admins,
    CollectionsInfo,
    Config,
    GetOwnerCollections(ActorId),
    AllCollections,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum StateReply {
    All(State),
    Admins(Vec<ActorId>),
    CollectionsInfo(Vec<(u16, CollectionInfo)>),
    Config(Config),
    OwnerCollections(Vec<ActorId>),
    AllCollections(Vec<(ActorId, Vec<ActorId>)>),
}

#[derive(Debug, Encode, Decode, TypeInfo, Clone)]
pub struct State {
    pub admins: Vec<ActorId>,
    pub owner_to_collection: Vec<(ActorId, Vec<ActorId>)>,
    pub time_creation: Vec<(ActorId, u64)>,
    pub collections: Vec<(u16, CollectionInfo)>,
    pub sale: Vec<((ActorId, u64), NftInfoForSale)>,
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
    Owner {
        token_id: u64,
    },
    IsApproved {
        to: ActorId,
        token_id: u64,
    },
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum NftEvent {
    Transferred {
        owner: ActorId,
        recipient: ActorId,
        token_id: u64,
    },
    Owner {
        owner: ActorId,
        token_id: u64,
    },
    IsApproved {
        to: ActorId,
        token_id: u64,
        approved: bool,
    },
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum NftError {
    Error(String),
}
