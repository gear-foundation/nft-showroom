#![no_std]

use gstd::prog::ProgramGenerator;
use nft_client::nft::io as nft_io;
use sails_rs::calls::ActionIo;
use sails_rs::collections::HashMap;
use sails_rs::gstd::{exec, msg};
use sails_rs::prelude::*;

mod utils;
use utils::*;

static mut STORAGE: Option<Storage> = None;

#[derive(Default)]
pub struct Storage {
    pub admins: Vec<ActorId>,
    pub collection_to_owner: HashMap<CollectionId, (TypeName, ActorId)>,
    pub time_creation: HashMap<ActorId, u64>,
    pub type_collections: HashMap<String, TypeCollectionInfo>,
    pub sales: HashMap<(CollectionId, TokenId), NftInfoForSale>,
    pub auctions: HashMap<(CollectionId, TokenId), Auction>,
    pub offers: HashMap<Offer, Price>,
    pub config: Config,
    pub minimum_value_for_trade: u128,
    pub allow_message: bool,
    pub allow_create_collection: bool,
}

#[derive(Encode, Decode, Debug, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum Event {
    Initialized {
        time_between_create_collections: u64,
        royalty_to_marketplace_for_trade: u16,
        royalty_to_marketplace_for_mint: u16,
        minimum_value_for_trade: u128,
        fee_per_uploaded_file: u128,
        max_creator_royalty: u16,
        max_number_of_images: u64,
    },
    NewCollectionAdded {
        code_id: CodeId,
        idl_link: String,
        type_name: String,
        type_description: String,
    },
    CollectionCreated {
        type_name: String,
        collection_address: ActorId,
    },
    Minted {
        collection_address: ActorId,
        minter: ActorId,
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
        collection_address: ActorId,
        token_id: u64,
        price: u128,
        current_owner: ActorId,
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
        current_price: u128,
    },
    AuctionCanceled {
        collection_address: ActorId,
        token_id: u64,
    },
    OfferCreated {
        collection_address: ActorId,
        token_id: u64,
        price: u128,
    },
    OfferCanceled {
        collection_address: ActorId,
        token_id: u64,
    },
    OfferAccepted {
        offer: Offer,
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
        config: Config,
        minimum_value_for_trade: u128,
    },
    BalanceHasBeenWithdrawn {
        value: u128,
    },
    ValueSent,
    AllowMessageChanged,
    AllowCreateCollectionChanged,
    CollectionTypeDeleted {
        type_name: String,
    },
}

#[derive(Encode, Decode, Debug, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
struct CreateCollectionReply {
    type_name: String,
    collection_address: ActorId,
}

#[allow(static_mut_refs)]
impl NftShowroomService {
    pub fn init(config: Config) -> Self {
        let Config {
            gas_for_creation,
            gas_for_transfer_token,
            gas_for_mint,
            gas_for_close_auction,
            gas_for_delete_collection,
            gas_for_get_info,
            time_between_create_collections,
            royalty_to_marketplace_for_trade,
            royalty_to_marketplace_for_mint,
            ms_in_block,
            fee_per_uploaded_file,
            max_creator_royalty,
            max_number_of_images,
        } = config;
        let existential_deposit = exec::env_vars().existential_deposit;
        let minimum_value_for_trade =
            existential_deposit * 10_000 / (10_000 - royalty_to_marketplace_for_trade) as u128;
        let nft_marketplace = Storage {
            admins: vec![msg::source()],
            config: Config {
                gas_for_creation,
                gas_for_transfer_token,
                gas_for_mint,
                gas_for_close_auction,
                gas_for_delete_collection,
                gas_for_get_info,
                time_between_create_collections,
                royalty_to_marketplace_for_trade,
                royalty_to_marketplace_for_mint,
                ms_in_block,
                fee_per_uploaded_file,
                max_creator_royalty,
                max_number_of_images,
            },
            minimum_value_for_trade,
            ..Default::default()
        };
        unsafe { STORAGE = Some(nft_marketplace) };

        msg::send_with_gas(
            0.into(),
            Event::Initialized {
                time_between_create_collections,
                royalty_to_marketplace_for_trade,
                royalty_to_marketplace_for_mint,
                minimum_value_for_trade,
                fee_per_uploaded_file,
                max_creator_royalty,
                max_number_of_images,
            },
            0,
            0,
        )
        .expect("Failed to encode or reply with `Event`.");
        Self(())
    }
    fn get_mut(&mut self) -> &'static mut Storage {
        unsafe { STORAGE.as_mut().expect("Storage is not initialized") }
    }
    fn get(&self) -> &'static Storage {
        unsafe { STORAGE.as_ref().expect("Storage is not initialized") }
    }
}

struct NftShowroomService(());

#[sails_rs::service(events = Event)]
#[allow(clippy::too_many_arguments)]
impl NftShowroomService {
    pub fn new() -> Self {
        Self(())
    }

    pub fn add_new_collection(
        &mut self,
        code_id: CodeId,
        idl_link: String,
        type_name: String,
        type_description: String,
        allow_create: bool,
    ) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(storage, &msg_src);

        let collection_info = TypeCollectionInfo {
            code_id,
            idl_link: idl_link.clone(),
            type_description: type_description.clone(),
            allow_create,
        };
        storage
            .type_collections
            .insert(type_name.clone(), collection_info.clone());

        self.emit_event(Event::NewCollectionAdded {
            code_id,
            idl_link,
            type_name,
            type_description,
        })
        .expect("Event Invocation Error");
    }

    pub fn delete_collection_type(&mut self, type_name: String) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(storage, &msg_src);

        storage.type_collections.remove(&type_name);

        self.emit_event(Event::CollectionTypeDeleted { type_name })
            .expect("Event Invocation Error");
    }

    pub async fn create_collection(
        &mut self,
        type_name: String,
        payload: Vec<u8>,
    ) -> CreateCollectionReply {
        let storage = self.get_mut();
        let msg_src = msg::source();
        let msg_value = msg::value();
        check_time_creation(storage, &msg_src);
        check_allow_create_collection(storage, &msg_src);
        check_allow_message(storage, &msg_src);

        let collection_info = storage
            .type_collections
            .get(&type_name)
            .expect("Wrong collection name");

        if !collection_info.allow_create {
            panic!("Access denied");
        }

        let create_program_future = ProgramGenerator::create_program_bytes_with_gas_for_reply(
            collection_info.code_id,
            payload,
            storage.config.gas_for_creation,
            msg_value - exec::env_vars().existential_deposit,
            0,
        )
        .unwrap_or_else(|e| panic(e));

        let (address, _) = create_program_future.await.unwrap_or_else(|e| panic(e));

        storage
            .collection_to_owner
            .insert(address, (type_name.clone(), msg_src));

        storage
            .time_creation
            .entry(msg_src)
            .insert(exec::block_timestamp());

        self.emit_event(Event::CollectionCreated {
            type_name: type_name.clone(),
            collection_address: address,
        })
        .expect("Event Invocation Error");

        CreateCollectionReply {
            type_name,
            collection_address: address,
        }
    }

    pub async fn mint(&mut self, collection_address: ActorId, img_link_id: Option<u64>) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        let msg_value = msg::value();
        check_allow_message(storage, &msg_src);

        let request = nft_io::GetPaymentForMint::encode_call();

        let reply_bytes = msg::send_bytes_with_gas_for_reply(
            collection_address,
            request,
            storage.config.gas_for_get_info,
            0,
            0,
        )
        .expect("Error in sending a message")
        .await
        .expect("Error in `GetPaymentForMint`");

        let payment_for_mint: u128 = nft_io::GetPaymentForMint::decode_reply(&reply_bytes)
            .expect("Error get payment for mint");

        let percent_to_marketplace = payment_for_mint
            * (storage.config.royalty_to_marketplace_for_mint as u128)
            / 10_000u128;

        if percent_to_marketplace + payment_for_mint != msg_value {
            panic("Wrong value");
        }

        let request = nft_io::Mint::encode_call(msg_src, img_link_id);

        msg::send_bytes_with_gas_for_reply(
            collection_address,
            request,
            storage.config.gas_for_mint,
            msg_value - percent_to_marketplace,
            0,
        )
        .expect("Error in sending a message")
        .await
        .expect("Error in `Mint`");

        self.emit_event(Event::Minted {
            collection_address,
            minter: msg_src,
        })
        .expect("Event Invocation Error");
    }

    pub async fn delete_collection(&mut self, collection_address: ActorId) {
        let storage = self.get_mut();
        let msg_src = msg::source();

        let (.., collection_owner) = storage
            .collection_to_owner
            .get(&collection_address)
            .expect("Wrong collection address");

        if storage.admins.contains(&msg_src) {
            storage.collection_to_owner.remove(&collection_address);
        } else if *collection_owner == msg_src {
            let request = nft_io::CanDelete::encode_call();

            let reply_bytes = msg::send_bytes_with_gas_for_reply(
                collection_address,
                request,
                storage.config.gas_for_delete_collection,
                0,
                0,
            )
            .expect("Error in sending a message")
            .await
            .expect("Error in `CanDelete`");

            let can_delete: bool =
                nft_io::CanDelete::decode_reply(&reply_bytes).expect("Error get payment for mint");

            if can_delete {
                storage.collection_to_owner.remove(&collection_address);
            } else {
                panic("Access denied");
            }
        } else {
            panic("Access denied");
        }

        self.emit_event(Event::CollectionDeleted { collection_address })
            .expect("Event Invocation Error");
    }

    pub fn add_admins(&mut self, users: Vec<ActorId>) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(storage, &msg_src);
        storage.admins.extend(users.clone());
        self.emit_event(Event::AdminsAdded { users })
            .expect("Event Invocation Error");
    }

    pub fn delete_admin(&mut self, user: ActorId) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(storage, &msg_src);
        storage.admins.retain(|&admin| admin != user);
        self.emit_event(Event::AdminDeleted { user })
            .expect("Event Invocation Error");
    }

    pub fn update_config(&mut self, config: Config) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(storage, &msg_src);

        storage.config = config.clone();

        let existential_deposit = exec::env_vars().existential_deposit;
        storage.minimum_value_for_trade = existential_deposit * 10_000
            / (10_000 - storage.config.royalty_to_marketplace_for_trade) as u128;

        self.emit_event(Event::ConfigUpdated {
            config,
            minimum_value_for_trade: storage.minimum_value_for_trade,
        })
        .expect("Event Invocation Error");
    }

    pub fn allow_message(&mut self, allow: bool) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(storage, &msg_src);
        storage.allow_message = allow;
        self.emit_event(Event::AllowMessageChanged)
            .expect("Event Invocation Error");
    }

    pub fn allow_create_collection(&mut self, allow: bool) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(storage, &msg_src);
        storage.allow_create_collection = allow;
        self.emit_event(Event::AllowCreateCollectionChanged)
            .expect("Event Invocation Error");
    }

    pub fn add_external_collection(&mut self, collection_address: ActorId, type_name: String) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(storage, &msg_src);

        if !storage.type_collections.contains_key(&type_name) {
            panic("Wrong collection name");
        }
        storage
            .collection_to_owner
            .insert(collection_address, (type_name.clone(), msg_src));

        self.emit_event(Event::CollectionCreated {
            type_name,
            collection_address,
        })
        .expect("Event Invocation Error");
    }

    pub fn balance_out(&mut self) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_admin(storage, &msg_src);

        let balance = exec::value_available();
        let existential_deposit = exec::env_vars().existential_deposit;
        if balance < 2 * existential_deposit {
            panic("Insufficient balance");
        }
        let value = balance - existential_deposit;
        msg::send_with_gas(msg_src, (), 0, value).expect("Error in sending value");

        self.emit_event(Event::BalanceHasBeenWithdrawn { value })
            .expect("Event Invocation Error");
    }

    pub async fn create_auction(
        &mut self,
        collection_address: ActorId,
        token_id: u64,
        min_price: u128,
        duration: u32,
    ) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_allow_message(storage, &msg_src);
        if !storage
            .collection_to_owner
            .contains_key(&collection_address)
        {
            panic("Wrong collection address");
        }
        if storage
            .auctions
            .contains_key(&(collection_address, token_id))
        {
            panic("Already on auction");
        }
        if storage.sales.contains_key(&(collection_address, token_id)) {
            panic("Already on sale");
        }

        if min_price < storage.minimum_value_for_trade {
            panic("Less than minimum value for trade");
        }

        // check token info
        let address_marketplace = exec::program_id();
        let (collection_owner, royalty) = check_token_info(
            storage,
            &collection_address,
            token_id,
            &msg_src,
            &address_marketplace,
        )
        .await;

        transfer_from_token(
            storage,
            collection_address,
            msg_src,
            address_marketplace,
            token_id,
        )
        .await;

        let current_time = exec::block_timestamp();
        storage
            .auctions
            .entry((collection_address, token_id))
            .or_insert(Auction {
                owner: msg_src,
                started_at: current_time,
                ended_at: current_time + (duration * storage.config.ms_in_block) as u64,
                current_price: min_price,
                current_winner: ActorId::zero(),
                collection_owner,
                royalty,
            });

        let request = [
            "NftShowroom".encode(),
            "CloseAuction".to_string().encode(),
            (collection_address, token_id).encode(),
        ]
        .concat();

        msg::send_bytes_with_gas_delayed(
            address_marketplace,
            request,
            storage.config.gas_for_close_auction,
            0,
            duration + 1,
        )
        .expect("Error in sending message");

        self.emit_event(Event::AuctionCreated {
            collection_address,
            token_id,
            min_price,
            duration_ms: (duration + 1) * storage.config.ms_in_block,
        })
        .expect("Event Invocation Error");
    }

    pub fn add_bid(&mut self, collection_address: ActorId, token_id: u64) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        let msg_value = msg::value();
        check_allow_message(storage, &msg_src);

        let auction = if let Some(auction) =
            storage.auctions.get_mut(&(collection_address, token_id))
        {
            if auction.ended_at < exec::block_timestamp() {
                panic("Auction closed");
            }

            // if the first bid, it may be equal to the `current_price` (initial bid)
            if auction.current_winner != ActorId::zero() && msg_value <= auction.current_price
                || auction.current_winner == ActorId::zero() && msg_value < auction.current_price
            {
                panic("Less or equal than bid");
            }
            auction
        } else {
            panic("There is no such auction");
        };

        if auction.current_winner != ActorId::zero() {
            // use send_with_gas with gas_limit = 0 to transfer the value directly to the balance, not to the mailbox.
            msg::send_with_gas(auction.current_winner, (), 0, auction.current_price)
                .expect("Error in sending value");
        }
        auction.current_winner = msg_src;
        auction.current_price = msg_value;

        self.emit_event(Event::BidAdded {
            collection_address,
            token_id,
            current_price: msg_value,
        })
        .expect("Event Invocation Error");
    }

    pub async fn close_auction(&mut self, collection_address: ActorId, token_id: u64) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        let program_id = exec::program_id();

        if msg_src != program_id && !storage.admins.contains(&msg_src) {
            panic("Access denied");
        }
        let auction = storage
            .auctions
            .get(&(collection_address, token_id))
            .expect("There is no such auction");

        if auction.ended_at > exec::block_timestamp() {
            panic("Deadline error");
        }

        if auction.current_winner == ActorId::zero() {
            transfer_from_token(
                storage,
                collection_address,
                program_id,
                auction.owner,
                token_id,
            )
            .await;
        } else {
            transfer_from_token(
                storage,
                collection_address,
                program_id,
                auction.current_winner,
                token_id,
            )
            .await;
            // transfer value to buyer and percent to collection creator
            currency_transfer(
                auction.collection_owner,
                auction.owner,
                auction.current_price,
                auction.royalty,
                storage.config.royalty_to_marketplace_for_trade,
            );
        }
        let price = auction.current_price;
        let current_owner = auction.current_winner;

        storage
            .auctions
            .remove(&(collection_address, token_id))
            .expect("Can't be None");

        self.emit_event(Event::AuctionClosed {
            collection_address,
            token_id,
            price,
            current_owner,
        })
        .expect("Event Invocation Error");
    }

    pub async fn cancel_auction(&mut self, collection_address: ActorId, token_id: u64) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_allow_message(storage, &msg_src);

        let auction = storage
            .auctions
            .get(&(collection_address, token_id))
            .expect("There is no such auction");

        if auction.owner != msg_src {
            panic("Access denied");
        }
        transfer_from_token(
            storage,
            collection_address,
            exec::program_id(),
            auction.owner,
            token_id,
        )
        .await;

        if auction.current_winner != ActorId::zero() {
            // use send_with_gas to transfer the value directly to the balance, not to the mailbox.
            msg::send_with_gas(auction.current_winner, (), 0, auction.current_price)
                .expect("Error in sending value");
        }

        storage
            .auctions
            .remove(&(collection_address, token_id))
            .expect("Can't be None");

        self.emit_event(Event::AuctionCanceled {
            collection_address,
            token_id,
        })
        .expect("Event Invocation Error");
    }

    pub async fn sell(&mut self, collection_address: ActorId, token_id: u64, price: u128) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_allow_message(storage, &msg_src);
        // check that this collection already exists in the marketplace
        if !storage
            .collection_to_owner
            .contains_key(&collection_address)
        {
            panic("Wrong collection address");
        }
        // check that this nft is not sale at this moment
        if storage.sales.contains_key(&(collection_address, token_id)) {
            panic("Already on sale");
        }
        // check if this nft is currently at auction
        if storage
            .auctions
            .contains_key(&(collection_address, token_id))
        {
            panic("Already on auction");
        }
        // check that the price is more than the minimum value for trade
        if price < storage.minimum_value_for_trade {
            panic("Less than minimum value for trade");
        }

        // send a message to the nft contract to find out information about the token
        let address_marketplace = exec::program_id();
        let (collection_owner, royalty) = check_token_info(
            storage,
            &collection_address,
            token_id,
            &msg_src,
            &address_marketplace,
        )
        .await;

        // send a message to the nft contract to transfer the token to the marketplace address
        // so that the token can be immediately transferred to the buyer upon purchase.
        transfer_from_token(
            storage,
            collection_address,
            msg_src,
            address_marketplace,
            token_id,
        )
        .await;

        // if the transfer was successful, add information about the sale to the contract
        storage.sales.insert(
            (collection_address, token_id),
            NftInfoForSale {
                price,
                token_owner: msg_src,
                collection_owner,
                royalty,
            },
        );

        self.emit_event(Event::SaleNft {
            collection_address,
            token_id,
            price,
            owner: msg_src,
        })
        .expect("Event Invocation Error");
    }

    pub async fn cancel_sale(&mut self, collection_address: ActorId, token_id: u64) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        let program_id = exec::program_id();
        check_allow_message(storage, &msg_src);
        // check that such a sale exists and that the sender of the message is the owner of the sale/nft
        if let Some(nft_info) = storage.sales.get(&(collection_address, token_id)) {
            if nft_info.token_owner == msg_src {
                // return the token to its owner
                transfer_from_token(
                    storage,
                    collection_address,
                    program_id,
                    nft_info.token_owner,
                    token_id,
                )
                .await;
                storage.sales.remove(&(collection_address, token_id));
            } else {
                panic("Access denied");
            }
        } else {
            panic("Sale does not exist");
        }
        self.emit_event(Event::SaleNftCanceled {
            collection_address,
            token_id,
        })
        .expect("Event Invocation Error");
    }

    pub async fn buy(&mut self, collection_address: ActorId, token_id: u64) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        let msg_value = msg::value();
        check_allow_message(storage, &msg_src);
        check_sale(storage, &collection_address, &token_id, msg_value);
        // transfer the token to the buyer
        transfer_from_token(
            storage,
            collection_address,
            exec::program_id(),
            msg_src,
            token_id,
        )
        .await;
        let nft = storage
            .sales
            .get(&(collection_address, token_id))
            .expect("Can't be None")
            .clone();
        // transfer value to owner of token and percent to collection creator
        currency_transfer(
            nft.collection_owner,
            nft.token_owner,
            nft.price,
            nft.royalty,
            storage.config.royalty_to_marketplace_for_trade,
        );
        // remove the sale from the marketplace
        storage
            .sales
            .remove(&(collection_address, token_id))
            .expect("Can't be None");

        self.emit_event(Event::NftSold {
            collection_address,
            token_id,
            price: nft.price,
            current_owner: msg_src,
        })
        .expect("Event Invocation Error");
    }

    pub async fn create_offer(&mut self, collection_address: ActorId, token_id: u64) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        let msg_value = msg::value();

        if msg_value < storage.minimum_value_for_trade {
            panic("Less than minimum value for trade");
        }
        if !storage
            .collection_to_owner
            .contains_key(&collection_address)
        {
            panic("Wrong collection address");
        }

        let request = nft_io::GetTokenInfo::encode_call(token_id);

        let reply_bytes = msg::send_bytes_with_gas_for_reply(
            collection_address,
            request,
            storage.config.gas_for_get_info,
            0,
            0,
        )
        .expect("Error in sending a message")
        .await
        .expect("Error in `GetTokenInfo`");

        let nft_client::TokenInfo { sellable, .. } =
            nft_io::GetTokenInfo::decode_reply(&reply_bytes).expect("Error get token info");

        if !sellable {
            panic("Not sellable");
        }

        let offer = Offer {
            collection_address,
            token_id,
            creator: msg_src,
        };
        storage
            .offers
            .entry(offer.clone())
            .and_modify(|price| {
                msg::send_with_gas(offer.creator, (), 0, *price).expect("Error in sending value");
                *price = msg_value;
            })
            .or_insert(msg_value);

        self.emit_event(Event::OfferCreated {
            collection_address,
            token_id,
            price: msg_value,
        })
        .expect("Event Invocation Error");
    }

    pub fn cancel_offer(&mut self, collection_address: ActorId, token_id: u64) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_allow_message(storage, &msg_src);
        let offer = Offer {
            collection_address,
            token_id,
            creator: msg_src,
        };

        if let Some((offer, price)) = storage.offers.get_key_value(&offer) {
            // use send_with_gas to transfer the value directly to the balance, not to the mailbox.
            msg::send_with_gas(offer.creator, (), 0, *price).expect("Error in sending value");
        } else {
            panic("Wrong data offer");
        }
        storage.offers.remove(&offer);

        self.emit_event(Event::OfferCanceled {
            collection_address,
            token_id,
        })
        .expect("Event Invocation Error");
    }
    pub async fn accept_offer(&mut self, offer: Offer) {
        let storage = self.get_mut();
        let msg_src = msg::source();
        check_allow_message(storage, &msg_src);

        if storage
            .sales
            .contains_key(&(offer.collection_address, offer.token_id))
        {
            panic("Already on sale");
        }
        if storage
            .auctions
            .contains_key(&(offer.collection_address, offer.token_id))
        {
            panic("Already on auction");
        }
        if !storage.offers.contains_key(&offer) {
            panic("Offer does not exist");
        }

        // check token info
        let address_marketplace = exec::program_id();
        let (collection_owner, royalty) = check_token_info(
            storage,
            &offer.collection_address,
            offer.token_id,
            &msg_src,
            &address_marketplace,
        )
        .await;

        transfer_from_token(
            storage,
            offer.collection_address,
            msg_src,
            offer.creator,
            offer.token_id,
        )
        .await;

        let price = storage.offers.get(&offer).expect("Can't be None");

        // transfer value to token owner and percent to collection creator
        currency_transfer(
            collection_owner,
            msg_src,
            *price,
            royalty,
            storage.config.royalty_to_marketplace_for_trade,
        );

        storage.offers.remove(&offer);

        self.emit_event(Event::OfferAccepted { offer })
            .expect("Event Invocation Error");
    }
    // Service's query
    pub fn get_admins(&self) -> &'static Vec<ActorId> {
        &self.get().admins
    }
    pub fn get_config(&self) -> &'static Config {
        &self.get().config
    }
    pub fn get_minimum_value_for_trade(&self) -> u128 {
        self.get().minimum_value_for_trade
    }
    pub fn get_allow_message(&self) -> bool {
        self.get().allow_message
    }
    pub fn get_allow_create_collection(&self) -> bool {
        self.get().allow_create_collection
    }
    pub fn get_collections_info(&self) -> Vec<(String, TypeCollectionInfo)> {
        self.get().type_collections.clone().into_iter().collect()
    }
    pub fn get_all_collections(&self) -> Vec<(CollectionId, (TypeName, ActorId))> {
        self.get().collection_to_owner.clone().into_iter().collect()
    }
    pub fn get_collection_info(&self, collection_address: ActorId) -> Option<CollectionInfo> {
        let storage = self.get();
        let collection_to_owner = storage.collection_to_owner.get(&collection_address);
        if let Some((type_name, owner)) = collection_to_owner {
            let idl_link = &storage
                .type_collections
                .get(type_name)
                .expect("This collection type name must exist")
                .idl_link;
            let collection_info = CollectionInfo {
                owner: *owner,
                type_name: type_name.clone(),
                idl_link: idl_link.clone(),
            };
            Some(collection_info)
        } else {
            None
        }
    }

    pub fn all(&self) -> StorageState {
        self.get().into()
    }
}

pub struct NftShowroomProgram(());

#[sails_rs::program(payable)]
impl NftShowroomProgram {
    // Program's constructor
    pub fn new(config: Config) -> Self {
        NftShowroomService::init(config);
        Self(())
    }

    // Exposed service
    pub fn nft_showroom(&self) -> NftShowroomService {
        NftShowroomService::new()
    }
}
