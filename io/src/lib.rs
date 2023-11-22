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
        id_collection: u128,
        payload: Vec<u8>,
    },
    DeleteCollection{
        id_collection: u128,
    },
    AddAdmin{
        users: Vec<ActorId>
    },
    DeleteAdmin{
        user: ActorId
    },
    UpdateConfig{
        config: Config
    },
}

#[derive(Encode, Decode, TypeInfo)]
pub enum NftMarketplaceEvent {
    NewCollectionAdded { collection_info: CollectionInfo },
    CollectionCreated { collection_address: ActorId },
}

// #[derive(Debug, Encode, Decode, TypeInfo)]
// pub struct State {
//     pub owner_to_collection: Vec<(ActorId, CollectionInfo)>,
//     pub collection_code_id: CodeId,
// }

#[derive(Encode, Decode, TypeInfo)]
pub enum StateQuery {
    Admins,
    CollectionsInfo,
    Config,
    GetOwnerCollections(ActorId),
    AllCollections,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum StateReply {
    Admins(Vec<ActorId>),
    CollectionsInfo(Vec<(u128, CollectionInfo)>),
    Config(Config),
    OwnerCollections(Vec<ActorId>),
    AllCollections(Vec<(ActorId, Vec<ActorId>)>),
}

#[derive(Debug, Encode, Decode, TypeInfo, Clone)]
pub struct CollectionInfo {
    pub code_id: CodeId,
    pub collection_id: u128,
    pub meta_link: String,
    pub description: String,
}

#[derive(Default, Debug, Encode, Decode, TypeInfo, Clone)]
pub struct Config {
    pub gas_for_creation: u64,
    pub time_between_create_collections: u64,
}
