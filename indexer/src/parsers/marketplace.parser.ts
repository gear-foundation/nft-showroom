import { HexString } from '@gear-js/api';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  Sails,
  getServiceNamePrefix,
  getFnNamePrefix,
  ActorId,
} from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';

export enum NftMarketplaceEventType {
  Initialized = 'isInitialized',
  NewCollectionAdded = 'isNewCollectionAdded',
  CollectionCreated = 'isCollectionCreated',
  SaleNft = 'isSaleNft',
  SaleNftCanceled = 'isSaleNftCanceled',
  NftSold = 'isNftSold',
  AuctionCreated = 'isAuctionCreated',
  BidAdded = 'isBidAdded',
  AuctionCanceled = 'isAuctionCanceled',
  AuctionClosed = 'isAuctionClosed',
  OfferCreated = 'isOfferCreated',
  OfferCanceled = 'isOfferCanceled',
  OfferAccepted = 'isOfferAccepted',
  CollectionDeleted = 'isCollectionDeleted',
  AdminsAdded = 'isAdminsAdded',
  AdminDeleted = 'isAdminDeleted',
  ConfigUpdated = 'isConfigUpdated',
}

export type Initialized = {
  type: NftMarketplaceEventType.Initialized;
  timeBetweenCreateCollections: bigint | null;
  royaltyToMarketplaceForTrade: number | null;
  royaltyToMarketplaceForMint: number | null;
  minimumValueForTrade: bigint | null;
  feePerUploadedFile: bigint | null;
  maxCreatorRoyalty: number | null;
  maxNumberOfImages: bigint | null;
};

export type NewCollectionAdded = {
  type: NftMarketplaceEventType.NewCollectionAdded;
  codeId: string;
  metaLink: string;
  typeName: string;
  typeDescription: string;
};

export type CollectionCreated = {
  type: NftMarketplaceEventType.CollectionCreated;
  typeName: string;
  collectionAddress: string;
};

export type SaleNft = {
  type: NftMarketplaceEventType.SaleNft;
  collectionAddress: string;
  tokenId: number;
  price: bigint;
  owner: string;
};

export type SaleNftCanceled = {
  type: NftMarketplaceEventType.SaleNftCanceled;
  collectionAddress: string;
  tokenId: number;
};

export type NftSold = {
  type: NftMarketplaceEventType.NftSold;
  currentOwner: string;
  tokenId: number;
  price: bigint;
  collectionAddress: string;
};

export type AuctionCreated = {
  type: NftMarketplaceEventType.AuctionCreated;
  collectionAddress: string;
  tokenId: number;
  minPrice: bigint;
  durationMs: number;
};

export type BidAdded = {
  type: NftMarketplaceEventType.BidAdded;
  collectionAddress: string;
  tokenId: number;
  price: bigint;
};

export type AuctionCanceled = {
  type: NftMarketplaceEventType.AuctionCanceled;
  collectionAddress: string;
  tokenId: number;
};

export type AuctionClosed = {
  type: NftMarketplaceEventType.AuctionClosed;
  collectionAddress: string;
  tokenId: number;
  price: bigint;
  currentOwner: string;
};

export type OfferCreated = {
  type: NftMarketplaceEventType.OfferCreated;
  collectionAddress: string;
  tokenId: number;
  price: bigint;
};

export type OfferCanceled = {
  type: NftMarketplaceEventType.OfferCanceled;
  collectionAddress: string;
  tokenId: number;
};

export type OfferAccepted = {
  type: NftMarketplaceEventType.OfferAccepted;
  offer: Offer;
};

export type Offer = {
  collectionAddress: string;
  tokenId: number;
  creator: string;
};

export type CollectionDeleted = {
  type: NftMarketplaceEventType.CollectionDeleted;
  collectionAddress: string;
};

export type AdminsAdded = {
  type: NftMarketplaceEventType.AdminsAdded;
  users: string[];
};

export type AdminDeleted = {
  type: NftMarketplaceEventType.AdminDeleted;
  user: string;
};

export type ConfigUpdated = {
  type: NftMarketplaceEventType.ConfigUpdated;
  gasForCreation: bigint | null;
  gasForTransferToken: bigint | null;
  gasForCloseAuction: bigint | null;
  gasForDeleteCollection: bigint | null;
  gasForGetTokenInfo: bigint | null;
  timeBetweenCreateCollections: bigint | null;
  feePerUploadedFile: bigint | null;
  royaltyToMarketplaceForTrade: number | null;
  royaltyToMarketplaceForMint: number | null;
  minimumTransferValue: bigint | null;
  msInBlock: number | null;
  minimumValueForTrade: bigint | null;
  minimumValueForMint: bigint | null;
  maxCreatorRoyalty: number | null;
  maxNumberOfImages: bigint | null;
};

export type NftMarketplaceEvent =
  | Initialized
  | NewCollectionAdded
  | CollectionCreated
  | SaleNft
  | SaleNftCanceled
  | NftSold
  | AuctionCreated
  | BidAdded
  | AuctionCanceled
  | AuctionClosed
  | OfferCreated
  | OfferCanceled
  | OfferAccepted
  | CollectionDeleted
  | AdminsAdded
  | AdminDeleted
  | ConfigUpdated;

export class MarketplaceParser {
  private sails?: Sails;

  async init() {
    const parser = await SailsIdlParser.new();
    this.sails = new Sails(parser);
    const idlPath = join(__dirname, '../../assets/marketplace.idl');
    const idl = readFileSync(idlPath, 'utf8');
    this.sails.parseIdl(idl);
  }

  parseEvent(payload: HexString): NftMarketplaceEvent | undefined {
    if (!this.sails) {
      throw new Error('Sails not initialized');
    }
    const serviceName = getServiceNamePrefix(payload);
    const functionName = getFnNamePrefix(payload);
    if (!this.sails.services[serviceName].events[functionName]) {
      return undefined;
    }
    const ev =
      this.sails.services[serviceName].events[functionName].decode(payload);
    switch (functionName) {
      case 'Initialized': {
        const event = ev as {
          time_between_create_collections: number | string | bigint;
          royalty_to_marketplace_for_trade: number;
          royalty_to_marketplace_for_mint: number;
          minimum_value_for_trade: number | string | bigint;
          fee_per_uploaded_file: number | string | bigint;
          max_creator_royalty: number;
          max_number_of_images: number | string | bigint;
        };
        return {
          type: NftMarketplaceEventType.Initialized,
          timeBetweenCreateCollections:
            typeof event.time_between_create_collections === 'bigint'
              ? event.time_between_create_collections
              : BigInt(event.time_between_create_collections),
          royaltyToMarketplaceForTrade: event.royalty_to_marketplace_for_trade,
          royaltyToMarketplaceForMint: event.royalty_to_marketplace_for_mint,
          minimumValueForTrade:
            typeof event.minimum_value_for_trade === 'bigint'
              ? event.minimum_value_for_trade
              : BigInt(event.minimum_value_for_trade),
          feePerUploadedFile:
            typeof event.fee_per_uploaded_file === 'bigint'
              ? event.fee_per_uploaded_file
              : BigInt(event.fee_per_uploaded_file),
          maxCreatorRoyalty: event.max_creator_royalty,
          maxNumberOfImages:
            typeof event.max_number_of_images === 'bigint'
              ? event.max_number_of_images
              : BigInt(event.max_number_of_images),
        };
      }
      case 'NewCollectionAdded': {
        const event = ev as {
          code_id: string;
          idl_link: string;
          type_name: string;
          type_description: string;
        };
        return {
          type: NftMarketplaceEventType.NewCollectionAdded,
          codeId: event.code_id,
          metaLink: event.idl_link,
          typeName: event.type_name,
          typeDescription: event.type_description,
        };
      }
      case 'CollectionCreated': {
        const event = ev as {
          type_name: string;
          collection_address: ActorId;
        };
        return {
          type: NftMarketplaceEventType.CollectionCreated,
          typeName: event.type_name,
          collectionAddress: event.collection_address,
        };
      }
      case 'SaleNft': {
        const event = ev as {
          collection_address: ActorId;
          token_id: number | string | bigint;
          price: number | string | bigint;
          owner: ActorId;
        };
        return {
          type: NftMarketplaceEventType.SaleNft,
          collectionAddress: event.collection_address,
          tokenId:
            typeof event.token_id === 'number'
              ? event.token_id
              : Number(event.token_id),
          price:
            typeof event.price === 'bigint' ? event.price : BigInt(event.price),
          owner: event.owner,
        };
      }
      case 'SaleNftCanceled': {
        const event = ev as {
          collection_address: ActorId;
          token_id: number | string | bigint;
        };
        return {
          type: NftMarketplaceEventType.SaleNftCanceled,
          collectionAddress: event.collection_address,
          tokenId:
            typeof event.token_id === 'number'
              ? event.token_id
              : Number(event.token_id),
        };
      }
      case 'NftSold': {
        const event = ev as {
          collection_address: ActorId;
          token_id: number | string | bigint;
          price: number | string | bigint;
          current_owner: ActorId;
        };
        return {
          type: NftMarketplaceEventType.NftSold,
          currentOwner: event.current_owner,
          tokenId:
            typeof event.token_id === 'number'
              ? event.token_id
              : Number(event.token_id),
          price:
            typeof event.price === 'bigint' ? event.price : BigInt(event.price),
          collectionAddress: event.collection_address,
        };
      }
      case 'AuctionCreated': {
        const event = ev as {
          collection_address: ActorId;
          token_id: number | string | bigint;
          min_price: number | string | bigint;
          duration_ms: number;
        };
        return {
          type: NftMarketplaceEventType.AuctionCreated,
          collectionAddress: event.collection_address,
          tokenId:
            typeof event.token_id === 'number'
              ? event.token_id
              : Number(event.token_id),
          minPrice:
            typeof event.min_price === 'bigint'
              ? event.min_price
              : BigInt(event.min_price),
          durationMs: event.duration_ms,
        };
      }
      case 'BidAdded': {
        const event = ev as {
          collection_address: ActorId;
          token_id: number | string | bigint;
          current_price: number | string | bigint;
        };
        return {
          type: NftMarketplaceEventType.BidAdded,
          collectionAddress: event.collection_address,
          tokenId:
            typeof event.token_id === 'number'
              ? event.token_id
              : Number(event.token_id),
          price:
            typeof event.current_price === 'bigint'
              ? event.current_price
              : BigInt(event.current_price),
        };
      }
      case 'AuctionCanceled': {
        const event = ev as {
          collection_address: ActorId;
          token_id: number | string | bigint;
        };
        return {
          type: NftMarketplaceEventType.AuctionCanceled,
          collectionAddress: event.collection_address,
          tokenId:
            typeof event.token_id === 'number'
              ? event.token_id
              : Number(event.token_id),
        };
      }
      case 'AuctionClosed': {
        const event = ev as {
          collection_address: ActorId;
          token_id: number | string | bigint;
          price: number | string | bigint;
          current_owner: ActorId;
        };
        return {
          type: NftMarketplaceEventType.AuctionClosed,
          collectionAddress: event.collection_address,
          tokenId:
            typeof event.token_id === 'number'
              ? event.token_id
              : Number(event.token_id),
          price:
            typeof event.price === 'bigint' ? event.price : BigInt(event.price),
          currentOwner: event.current_owner,
        };
      }
      case 'OfferCreated': {
        const event = ev as {
          collection_address: ActorId;
          token_id: number | string | bigint;
          price: number | string | bigint;
        };
        return {
          type: NftMarketplaceEventType.OfferCreated,
          collectionAddress: event.collection_address,
          tokenId:
            typeof event.token_id === 'number'
              ? event.token_id
              : Number(event.token_id),
          price:
            typeof event.price === 'bigint' ? event.price : BigInt(event.price),
        };
      }
      case 'OfferCanceled': {
        const event = ev as {
          collection_address: ActorId;
          token_id: number | string | bigint;
        };
        return {
          type: NftMarketplaceEventType.OfferCanceled,
          collectionAddress: event.collection_address,
          tokenId:
            typeof event.token_id === 'number'
              ? event.token_id
              : Number(event.token_id),
        };
      }
      case 'OfferAccepted': {
        const event = ev as {
          offer: {
            collection_address: ActorId;
            token_id: number | string | bigint;
            creator: ActorId;
          };
        };
        return {
          type: NftMarketplaceEventType.OfferAccepted,
          offer: {
            collectionAddress: event.offer.collection_address,
            tokenId:
              typeof event.offer.token_id === 'number'
                ? event.offer.token_id
                : Number(event.offer.token_id),
            creator: event.offer.creator,
          },
        };
      }
      case 'CollectionDeleted': {
        const event = ev as { collection_address: ActorId };
        return {
          type: NftMarketplaceEventType.CollectionDeleted,
          collectionAddress: event.collection_address,
        };
      }
      case 'AdminsAdded': {
        const event = ev as { users: Array<ActorId> };
        return {
          type: NftMarketplaceEventType.AdminsAdded,
          users: event.users,
        };
      }
      case 'AdminDeleted': {
        const event = ev as { user: ActorId };
        return {
          type: NftMarketplaceEventType.AdminDeleted,
          user: event.user,
        };
      }
      case 'ConfigUpdated': {
        const event = ev as {
          gas_for_creation: number | string | bigint | null;
          gas_for_mint: number | string | bigint | null;
          gas_for_transfer_token: number | string | bigint | null;
          gas_for_close_auction: number | string | bigint | null;
          gas_for_delete_collection: number | string | bigint | null;
          gas_for_get_info: number | string | bigint | null;
          time_between_create_collections: number | string | bigint | null;
          royalty_to_marketplace_for_trade: number | null;
          royalty_to_marketplace_for_mint: number | null;
          ms_in_block: number | null;
          minimum_value_for_trade: number | string | bigint | null;
          fee_per_uploaded_file: number | string | bigint | null;
          max_creator_royalty: number | null;
          max_number_of_images: number | string | bigint | null;
        };
        return {
          type: NftMarketplaceEventType.ConfigUpdated,
          gasForCreation: event.gas_for_creation
            ? typeof event.gas_for_creation === 'bigint'
              ? event.gas_for_creation
              : BigInt(event.gas_for_creation)
            : null,
          gasForTransferToken: event.gas_for_transfer_token
            ? typeof event.gas_for_transfer_token === 'bigint'
              ? event.gas_for_transfer_token
              : BigInt(event.gas_for_transfer_token)
            : null,
          gasForCloseAuction: event.gas_for_close_auction
            ? typeof event.gas_for_close_auction === 'bigint'
              ? event.gas_for_close_auction
              : BigInt(event.gas_for_close_auction)
            : null,
          gasForDeleteCollection: event.gas_for_delete_collection
            ? typeof event.gas_for_delete_collection === 'bigint'
              ? event.gas_for_delete_collection
              : BigInt(event.gas_for_delete_collection)
            : null,
          gasForGetTokenInfo: event.gas_for_get_info
            ? typeof event.gas_for_get_info === 'bigint'
              ? event.gas_for_get_info
              : BigInt(event.gas_for_get_info)
            : null,
          timeBetweenCreateCollections: event.time_between_create_collections
            ? typeof event.time_between_create_collections === 'bigint'
              ? event.time_between_create_collections
              : BigInt(event.time_between_create_collections)
            : null,
          feePerUploadedFile: event.fee_per_uploaded_file
            ? typeof event.fee_per_uploaded_file === 'bigint'
              ? event.fee_per_uploaded_file
              : BigInt(event.fee_per_uploaded_file)
            : null,
          royaltyToMarketplaceForTrade: event.royalty_to_marketplace_for_trade,
          royaltyToMarketplaceForMint: event.royalty_to_marketplace_for_mint,
          minimumTransferValue: event.minimum_value_for_trade
            ? typeof event.minimum_value_for_trade === 'bigint'
              ? event.minimum_value_for_trade
              : BigInt(event.minimum_value_for_trade)
            : null,
          msInBlock: event.ms_in_block,
          minimumValueForTrade: event.minimum_value_for_trade
            ? typeof event.minimum_value_for_trade === 'bigint'
              ? event.minimum_value_for_trade
              : BigInt(event.minimum_value_for_trade)
            : null,
          minimumValueForMint: null,
          maxCreatorRoyalty: event.max_creator_royalty,
          maxNumberOfImages: event.max_number_of_images
            ? typeof event.max_number_of_images === 'bigint'
              ? event.max_number_of_images
              : BigInt(event.max_number_of_images)
            : null,
        };
      }
    }
  }
}

let parser: MarketplaceParser | null = null;
export async function getMarketplaceParser() {
  if (!parser) {
    parser = new MarketplaceParser();
    await parser.init();
  }
  return parser;
}
