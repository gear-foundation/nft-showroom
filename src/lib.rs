#![no_std]

use gstd::{
    collections::{HashMap, HashSet},
    debug, exec, msg,
    prelude::*,
    prog::ProgramGenerator,
    ActorId, CodeId,
};
use nft_marketplace_io::*;
type Id = u128;

#[derive(Default)]
pub struct NftMarketplace {
    pub admins: Vec<ActorId>,
    pub owner_to_collection: HashMap<ActorId, HashSet<ActorId>>,
    pub time_creation: HashMap<ActorId, u64>,
    pub collections: HashMap<Id, CollectionInfo>,
    pub config: Config,
}

static mut NFT_MARKETPLACE: Option<NftMarketplace> = None;

#[no_mangle]
extern "C" fn init() {
    let NftMarketplaceInit {
        gas_for_creation,
        time_between_create_collections,
    } = msg::load().expect("Unable to decode `NftMarketplaceInit`");

    let nft_marketplace = NftMarketplace {
        admins: vec![msg::source()],
        config: Config {
            gas_for_creation,
            time_between_create_collections,
        },
        ..Default::default()
    };
    unsafe { NFT_MARKETPLACE = Some(nft_marketplace) };
}

#[gstd::async_main]
async fn main() {
    let action: NftMarketplaceAction =
        msg::load().expect("Unable to decode `NftMarketplaceAction`");
    let nft_marketplace = unsafe {
        NFT_MARKETPLACE
            .as_mut()
            .expect("`Collection Factory` is not initialized.")
    };
    match action {
        NftMarketplaceAction::AddNewCollection {
            code_id,
            meta_link,
            description,
        } => {
            nft_marketplace.add_new_collection(code_id, meta_link, description);
        }
        NftMarketplaceAction::CreateCollection {
            id_collection,
            payload,
        } => {
            nft_marketplace
                .create_collection(id_collection, payload)
                .await;
        }
        NftMarketplaceAction::DeleteCollection {
            id_collection,
        } => {
            nft_marketplace.delete_collection(id_collection);
        }
        NftMarketplaceAction::AddAdmin {
            users,
        } => {
            nft_marketplace.add_admin(users);
        }
        NftMarketplaceAction::DeleteAdmin {
            user,
        } => {
            nft_marketplace.delete_admin(user);
        }
        NftMarketplaceAction::UpdateConfig {
            config,
        } => {
            nft_marketplace.update_config(config);
        }
    }
}

impl NftMarketplace {
    pub fn add_new_collection(
        &mut self,
        code_id: CodeId,
        meta_link: String,
        description: String,
    ) {
        let msg_src = msg::source();
        if !self.admins.contains(&msg_src) {
            panic!("You are not an admin");
        }
        let max_key = *self.collections.keys().max().unwrap_or(&0);


        let collection_info = CollectionInfo {
            code_id,
            collection_id: max_key + 1,
            meta_link,
            description,
        };
        self.collections.insert(max_key + 1, collection_info.clone());

        msg::reply(
            NftMarketplaceEvent::NewCollectionAdded { collection_info },
            0,
        )
        .expect("Error during a reply `NftMarketplaceEvent::NewCollectionAdded`");
    }
    pub async fn create_collection(&mut self, id_collection: u128, payload: Vec<u8>) {
        let msg_src = msg::source();
        debug!("Create collection");

        if let Some(time) = self.time_creation.get(&msg_src) {
            if exec::block_timestamp() - time < self.config.time_between_create_collections
                && !self.admins.contains(&msg_src)
            {
                panic!("You can only create one collection per hour");
            }
        }

        let collection_info = self
            .collections
            .get(&id_collection)
            .expect("Unable to get Nft collection info");
        debug!("CODE ID {:?}", collection_info.code_id);
        let (address, _) = ProgramGenerator::create_program_bytes_with_gas_for_reply(
            collection_info.code_id,
            payload,
            self.config.gas_for_creation,
            0,
            0,
        )
        .expect("Error during Collection program initialization")
        .await
        .expect("Program was not initialized");

        debug!("Create collection");

        self.owner_to_collection
            .entry(msg_src)
            .and_modify(|collections| {
                collections.insert(address);
            })
            .or_insert_with(|| {
                let mut collections = HashSet::new();
                collections.insert(address);

                collections
            });

        self.time_creation.entry(msg_src).insert(exec::block_timestamp());

        msg::reply(
            NftMarketplaceEvent::CollectionCreated {
                collection_address: address,
            },
            0,
        )
        .expect("Error during a reply `NftMarketplaceEvent::CollectionCreated`");
    }
    pub fn delete_collection(
        &mut self,
        id_collection: u128,
    ){
        let msg_src = msg::source();
        if !self.admins.contains(&msg_src) {
            panic!("You are not an admin");
        }
        if self.collections.remove(&id_collection).is_none() {
            panic!("There is no collection with this id");
        }
    
    }
    pub fn add_admin(
        &mut self,
        users: Vec<ActorId>
    ){
        let msg_src = msg::source();
        if !self.admins.contains(&msg_src) {
            panic!("You are not an admin");
        }
        self.admins.extend(users);
    }
    pub fn delete_admin(
        &mut self,
        users: ActorId,
    ){
        let msg_src = msg::source();
        if !self.admins.contains(&msg_src) {
            panic!("You are not an admin");
        }
        self.admins.retain(|&admin| admin != users);
    }
    pub fn update_config(
        &mut self,
        config: Config
    ){
        let msg_src = msg::source();
        if !self.admins.contains(&msg_src) {
            panic!("You are not an admin");
        }
        self.config = config;
    }
}

#[no_mangle]
extern "C" fn state() {
    let nft_marketplace = unsafe {
        NFT_MARKETPLACE
            .take()
            .expect("Contract state is uninitialized")
    };
    let query: StateQuery = msg::load().expect("Unable to load the state query");
    match query {
        StateQuery::Admins => {
            msg::reply(StateReply::Admins(nft_marketplace.admins), 0)
                .expect("Unable to share the state");
        }
        StateQuery::CollectionsInfo => {
            let collections = nft_marketplace
                .collections
                .iter()
                .map(|(id, collection_info)| (*id, collection_info.clone()))
                .collect();
            msg::reply(StateReply::CollectionsInfo(collections), 0)
                .expect("Unable to share the state");
        }
        StateQuery::Config => {
            msg::reply(StateReply::Config(nft_marketplace.config), 0)
                .expect("Unable to share the state");
        }
        StateQuery::GetOwnerCollections(owner) => {
            let address_collection = nft_marketplace
                .owner_to_collection
                .get(&owner)
                .expect("This address was not involved in the creation of the collection");
            msg::reply(
                StateReply::OwnerCollections(address_collection.iter().cloned().collect()),
                0,
            )
            .expect("Unable to share the state");
        }
        StateQuery::AllCollections => {
            let owner_to_collection = nft_marketplace
                .owner_to_collection
                .iter()
                .map(|(owner, collections)| (*owner, collections.iter().cloned().collect()))
                .collect();
            msg::reply(StateReply::AllCollections(owner_to_collection), 0)
                .expect("Unable to share the state");
        }
    }
}
