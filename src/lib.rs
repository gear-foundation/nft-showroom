#![no_std]

use gstd::{
    collections::{HashMap, HashSet},
    debug, exec, msg,
    prelude::*,
    prog::ProgramGenerator,
    ActorId, CodeId,
};
use nft_marketplace_io::*;

#[derive(Default)]
pub struct NftMarketplace {
    pub admins: Vec<ActorId>,
    pub owner_to_collection: HashMap<ActorId, HashSet<ActorId>>,
    pub time_creation: HashMap<ActorId, u64>,
    pub collections: HashMap<Id, CollectionInfo>,
    pub sale: HashMap<(ActorId, u64), NftInfoForSale>,
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
        NftMarketplaceAction::SaleNft {
            collection_address,
            token_id,
            price
        } => {
            nft_marketplace
                .sell(collection_address, token_id, price).await;
        }
        NftMarketplaceAction::BuyNft {
            collection_address,
            token_id,
        } => {
            nft_marketplace
                .buy(collection_address, token_id).await;
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
            gas_for_creation,
            time_between_create_collections
        } => {
            nft_marketplace.update_config(gas_for_creation, time_between_create_collections);
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
        debug!("PAYLOAD {:?}", payload);
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

    pub async fn sell(&mut self, collection_address: ActorId, token_id: u64, price: u128) {

        // user approve mp 
        // user sell -> mp self-transfer () -> reply(to, token_id, owner)
        // sell address_collection, token_id, msg::src

        // check that this nft is not sale at this moment 
        if self.sale.contains_key(&(collection_address, token_id)){
            panic!("This nft isalready on sale");
        }

        // first we should check owner 
        let msg_src = msg::source();
        let owner_payload = NftAction::Owner { token_id: token_id.clone() };
        let reply = msg::send_for_reply_as::<NftAction, NftEvent>(
            collection_address,
            owner_payload,
            0,
            0
            )
        .expect("Error during Collection program initialization")
        .await
        .expect("Program was not initialized");

        debug!("reply: {:?}", reply);

        match reply {
            NftEvent::Owner { owner, ..} => {
                if owner != msg::source(){
                    panic!("Only the owner can put his NFT up for sale")
                }
            },
            _ => panic!("Wrong received reply"),
        }

        // second we should check that user give approve to marketplace 
        let address_marketplace = exec::program_id();
        let is_approved_payload = NftAction::IsApproved { to: address_marketplace.clone(), token_id: token_id.clone() };
        let reply = msg::send_for_reply_as::<NftAction, NftEvent>(
            collection_address,
            is_approved_payload,
            0,
            0
            )
        .expect("Error during Collection program initialization")
        .await
        .expect("Program was not initialized");

        debug!("reply: {:?}", reply);
        match reply {
            NftEvent::IsApproved { approved , ..} => {
                if !approved{
                    panic!("You must give approve to the marketplace")
                }
            },
            _ => panic!("Wrong received reply"),
        }

        // transfer nft to marketplace
        debug!("!!!!!!!!!!!!!!!!!! {:?} {:?}", msg_src, address_marketplace);
        let transfer_payload = NftAction::TransferFrom { from: msg_src, to: address_marketplace, token_id: token_id.clone() };
        let reply = msg::send_for_reply_as::<NftAction, NftEvent>(
            collection_address,
            transfer_payload,
            0,
            0
            )
        .expect("Error during Collection program initialization")
        .await
        .expect("Program was problem with transfer");
        debug!("reply: {:?}", reply);

        match reply {
            NftEvent::Transferred { owner, recipient, token_id } => {
                // self.sale.insert((collection_address, token_id), NftInfoForSale{price: price.clone(), owner}).expect("Error during crate sale");
                self.sale
                    .entry((collection_address, token_id))
                    .or_insert(NftInfoForSale{price: price.clone(), owner});
            },
            _ => panic!("Wrong received reply"),
        }
        
        msg::reply(
            NftMarketplaceEvent::SaleNft {
                collection_address,
                token_id,
                price,
                owner: msg_src,
            },
            0,
        )
        .expect("Error during a reply `NftMarketplaceEvent::SaleNft`");
    }

    pub async fn buy(&mut self, collection_address: ActorId, token_id: u64) {
        let payment = msg::value();
        let buyer = msg::source();
        let nft = self.sale.get(&(collection_address, token_id)).expect("There is no sale with such data");
        if payment < nft.price {
            panic!("Less than the agreed price ");
        }

        // transfer nft to new owner
        let transfer_payload = NftAction::Transfer { to: buyer, token_id: token_id.clone() };
        let reply = msg::send_for_reply_as::<NftAction, NftEvent>(
            collection_address,
            transfer_payload,
            0,
            0
            )
            .expect("Error during Collection program initialization")
            .await
            .expect("Program was problem with transfer");


        match reply {
            NftEvent::Transferred { owner, recipient: _, token_id } => {
            },
            _ => panic!("Wrong received reply"),
        }
        
        debug!("reply: {:?}", reply);
        msg::send_with_gas(nft.owner.clone(), "", 0, nft.price).expect("Error in sending value");


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
        gas_for_creation: Option<u64>,
        time_between_create_collections: Option<u64>
    ){
        let msg_src = msg::source();
        if !self.admins.contains(&msg_src) {
            panic!("You are not an admin");
        }
        gas_for_creation.map(|gas| self.config.gas_for_creation = gas);
        time_between_create_collections.map(|time| self.config.time_between_create_collections = time);
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

        StateQuery::All => {
            msg::reply(StateReply::All(nft_marketplace.into()), 0)
                .expect("Unable to share the state");
        }

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


impl From<NftMarketplace> for State {
    fn from(value: NftMarketplace) -> Self {
        let NftMarketplace {
            admins,
            owner_to_collection,
            time_creation,
            collections,
            sale,
            config,
        } = value;

        let owner_to_collection = owner_to_collection
            .iter()
            .map(|(owner, collections)| (*owner, collections.iter().cloned().collect()))
            .collect();

        let time_creation = time_creation
            .iter()
            .map(|(id, time)| (*id, time.clone()))
            .collect();

        let collections = collections
            .iter()
            .map(|(id, collection_info)| (*id, collection_info.clone()))
            .collect();

        let sale = sale
            .iter()
            .map(|(id, info)| (*id, info.clone()))
            .collect();



        Self {
            admins,
            owner_to_collection,
            time_creation,
            collections,
            sale,
            config,
        }
    }
}
