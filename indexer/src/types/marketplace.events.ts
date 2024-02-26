import { Enum, Option, Text, Vec, u64, u128, u32, u16 } from '@polkadot/types';
import { Hash } from '@polkadot/types/interfaces';
import { CodeId } from '@gear-js/api';
import {
  safeUnwrapOptional,
  safeUnwrapToBigInt,
  safeUnwrapToNumber,
} from './event.utils';

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

export interface NftMarketplaceEventPlain extends Enum {
  initialized: {
    timeBetweenCreateCollections: u64;
    feePerUploadedFile: u128;
    minimumTransferValue: u128;
    royaltyToMarketplaceForTrade: u16;
    royaltyToMarketplaceForMint: u16;
    gasForCreation: Option<u64>;
    gasForTransferToken: Option<u64>;
    gasForCloseAuction: Option<u64>;
    gasForDeleteCollection: Option<u64>;
    gasForGetTokenInfo: Option<u64>;
    msInBlock: Option<u32>;
  };
  newCollectionAdded: {
    codeId: CodeId;
    metaLink: Text;
    typeName: Text;
    typeDescription: Text;
  };
  collectionCreated: {
    typeName: Text;
    collectionAddress: Hash;
  };
  saleNft: {
    collectionAddress: Hash;
    tokenId: u64;
    price: u128;
    owner: Hash;
  };
  saleNftCanceled: {
    collectionAddress: Hash;
    tokenId: u64;
  };
  nftSold: {
    currentOwner: Hash;
    tokenId: u64;
    price: u128;
    collectionAddress: Hash;
  };
  auctionCreated: {
    collectionAddress: Hash;
    tokenId: u64;
    minPrice: u128;
    durationMs: u32;
  };
  bidAdded: {
    collectionAddress: Hash;
    tokenId: u64;
    currentPrice: u128;
  };
  auctionCanceled: {
    collectionAddress: Hash;
    tokenId: u64;
  };
  auctionClosed: {
    collectionAddress: Hash;
    tokenId: u64;
    price: u128;
    currentOwner: Hash;
  };
  offerCreated: {
    collectionAddress: Hash;
    tokenId: u64;
    price: u128;
  };
  offerCanceled: {
    collectionAddress: Hash;
    tokenId: u64;
  };
  offerAccepted: {
    offer: {
      collectionAddress: Hash;
      tokenId: u64;
      creator: Hash;
    };
  };
  collectionDeleted: {
    collectionAddress: Hash;
  };
  adminsAdded: {
    users: Vec<Hash>;
    collectionAddress: Hash;
  };
  adminDeleted: {
    user: Hash;
    collectionAddress: Hash;
  };
  configUpdated: {
    gasForCreation: Option<u64>;
    gasForTransferToken: Option<u64>;
    gasForCloseAuction: Option<u64>;
    gasForDeleteCollection: Option<u64>;
    gasForGetTokenInfo: Option<u64>;
    timeBetweenCreateCollections: Option<u64>;
    minimumTransferValue: Option<u128>;
    msInBlock: Option<u32>;
    feePerUploadedFile: Option<u128>;
    royaltyToMarketplaceForTrade: Option<u16>;
    royaltyToMarketplaceForMint: Option<u16>;
  };
}

export function getMarketplaceEvent(
  event: NftMarketplaceEventPlain,
): NftMarketplaceEvent | undefined {
  if (event.newCollectionAdded) {
    return {
      type: NftMarketplaceEventType.NewCollectionAdded,
      codeId: event.newCollectionAdded.codeId.toString(),
      metaLink: event.newCollectionAdded.metaLink.toString(),
      typeName: event.newCollectionAdded.typeName.toString(),
      typeDescription: event.newCollectionAdded.typeDescription.toString(),
    };
  }
  if (event.collectionCreated) {
    return {
      type: NftMarketplaceEventType.CollectionCreated,
      typeName: event.collectionCreated.typeName.toString(),
      collectionAddress: event.collectionCreated.collectionAddress.toString(),
    };
  }
  if (event.saleNft) {
    return {
      type: NftMarketplaceEventType.SaleNft,
      collectionAddress: event.saleNft.collectionAddress.toString(),
      tokenId: safeUnwrapToNumber(event.saleNft.tokenId)!,
      price: safeUnwrapToBigInt(event.saleNft.price)!,
      owner: event.saleNft.owner.toString(),
    };
  }
  if (event.saleNftCanceled) {
    return {
      type: NftMarketplaceEventType.SaleNftCanceled,
      collectionAddress: event.saleNftCanceled.collectionAddress.toString(),
      tokenId: safeUnwrapToNumber(event.saleNftCanceled.tokenId)!,
    };
  }
  if (event.nftSold) {
    return {
      type: NftMarketplaceEventType.NftSold,
      currentOwner: event.nftSold.currentOwner.toString(),
      tokenId: safeUnwrapToNumber(event.nftSold.tokenId)!,
      price: safeUnwrapToBigInt(event.nftSold.price)!,
      collectionAddress: event.nftSold.collectionAddress.toString(),
    };
  }
  if (event.auctionCreated) {
    return {
      type: NftMarketplaceEventType.AuctionCreated,
      collectionAddress: event.auctionCreated.collectionAddress.toString(),
      tokenId: safeUnwrapToNumber(event.auctionCreated.tokenId)!,
      minPrice: safeUnwrapToBigInt(event.auctionCreated.minPrice)!,
      durationMs: safeUnwrapToNumber(event.auctionCreated.durationMs)!,
    };
  }
  if (event.bidAdded) {
    return {
      type: NftMarketplaceEventType.BidAdded,
      collectionAddress: event.bidAdded.collectionAddress.toString(),
      tokenId: safeUnwrapToNumber(event.bidAdded.tokenId)!,
      price: safeUnwrapToBigInt(event.bidAdded.currentPrice)!,
    };
  }
  if (event.auctionCanceled) {
    return {
      type: NftMarketplaceEventType.AuctionCanceled,
      collectionAddress: event.auctionCanceled.collectionAddress.toString(),
      tokenId: safeUnwrapToNumber(event.auctionCanceled.tokenId)!,
    };
  }
  if (event.auctionClosed) {
    return {
      type: NftMarketplaceEventType.AuctionClosed,
      collectionAddress: event.auctionClosed.collectionAddress.toString(),
      tokenId: safeUnwrapToNumber(event.auctionClosed.tokenId)!,
      price: safeUnwrapToBigInt(event.auctionClosed.price)!,
      currentOwner: event.auctionClosed.currentOwner.toString(),
    };
  }
  if (event.offerCreated) {
    return {
      type: NftMarketplaceEventType.OfferCreated,
      collectionAddress: event.offerCreated.collectionAddress.toString(),
      tokenId: safeUnwrapToNumber(event.offerCreated.tokenId)!,
      price: safeUnwrapToBigInt(event.offerCreated.price)!,
    };
  }
  if (event.offerCanceled) {
    return {
      type: NftMarketplaceEventType.OfferCanceled,
      collectionAddress: event.offerCanceled.collectionAddress.toString(),
      tokenId: safeUnwrapToNumber(event.offerCanceled.tokenId)!,
    };
  }
  if (event.offerAccepted) {
    return {
      type: NftMarketplaceEventType.OfferAccepted,
      offer: {
        collectionAddress:
          event.offerAccepted.offer.collectionAddress.toString(),
        tokenId: safeUnwrapToNumber(event.offerAccepted.offer.tokenId)!,
        creator: event.offerAccepted.offer.creator.toString(),
      },
    };
  }
  if (event.collectionDeleted) {
    return {
      type: NftMarketplaceEventType.CollectionDeleted,
      collectionAddress: event.collectionDeleted.collectionAddress.toString(),
    };
  }
  if (event.adminsAdded) {
    return {
      type: NftMarketplaceEventType.AdminsAdded,
      users: event.adminsAdded.users.map((user) => user.toString()),
    };
  }
  if (event.adminDeleted) {
    return {
      type: NftMarketplaceEventType.AdminDeleted,
      user: event.adminDeleted.user.toString(),
    };
  }
  if (event.configUpdated) {
    return {
      type: NftMarketplaceEventType.ConfigUpdated,
      gasForCreation: safeUnwrapToBigInt(
        safeUnwrapOptional<u64, number>(event.configUpdated.gasForCreation),
      ),
      gasForTransferToken: safeUnwrapToBigInt(
        safeUnwrapOptional<u64, number>(
          event.configUpdated.gasForTransferToken,
        ),
      ),
      gasForCloseAuction: safeUnwrapToBigInt(
        safeUnwrapOptional<u64, number>(event.configUpdated.gasForCloseAuction),
      ),
      gasForDeleteCollection: safeUnwrapToBigInt(
        safeUnwrapOptional<u64, number>(
          event.configUpdated.gasForDeleteCollection,
        ),
      ),
      gasForGetTokenInfo: safeUnwrapToBigInt(
        safeUnwrapOptional<u64, number>(event.configUpdated.gasForGetTokenInfo),
      ),
      timeBetweenCreateCollections: safeUnwrapToBigInt(
        safeUnwrapOptional<u64, number>(
          event.configUpdated.timeBetweenCreateCollections,
        ),
      ),
      minimumTransferValue: safeUnwrapToBigInt(
        safeUnwrapOptional<u128, number>(
          event.configUpdated.minimumTransferValue,
        ),
      ),
      msInBlock: safeUnwrapToNumber(
        safeUnwrapOptional<u32, number>(event.configUpdated.msInBlock),
      ),
      feePerUploadedFile: safeUnwrapToBigInt(
        safeUnwrapOptional<u128, bigint>(
          event.configUpdated.feePerUploadedFile,
        ),
      ),
      royaltyToMarketplaceForTrade: safeUnwrapToNumber(
        safeUnwrapOptional<u16, number>(
          event.configUpdated.royaltyToMarketplaceForTrade,
        ),
      ),
      royaltyToMarketplaceForMint: safeUnwrapToNumber(
        safeUnwrapOptional<u16, number>(
          event.configUpdated.royaltyToMarketplaceForMint,
        ),
      ),
    };
  }
  if (event.initialized) {
    return {
      type: NftMarketplaceEventType.Initialized,
      gasForCreation: safeUnwrapToBigInt(
        safeUnwrapOptional<u64, number>(event.initialized.gasForCreation),
      ),
      gasForTransferToken: safeUnwrapToBigInt(
        safeUnwrapOptional<u64, number>(event.initialized.gasForTransferToken),
      ),
      gasForCloseAuction: safeUnwrapToBigInt(
        safeUnwrapOptional<u64, number>(event.initialized.gasForCloseAuction),
      ),
      gasForDeleteCollection: safeUnwrapToBigInt(
        safeUnwrapOptional<u64, number>(
          event.initialized.gasForDeleteCollection,
        ),
      ),
      gasForGetTokenInfo: safeUnwrapToBigInt(
        safeUnwrapOptional<u64, number>(event.initialized.gasForGetTokenInfo),
      ),
      timeBetweenCreateCollections: safeUnwrapToBigInt(
        event.initialized.timeBetweenCreateCollections,
      ),
      minimumTransferValue: safeUnwrapToBigInt(
        event.initialized.minimumTransferValue,
      ),
      msInBlock: safeUnwrapToNumber(
        safeUnwrapOptional<u32, number>(event.initialized.msInBlock),
      ),
      feePerUploadedFile: safeUnwrapToBigInt(
        event.initialized.feePerUploadedFile,
      ),
      royaltyToMarketplaceForTrade: safeUnwrapToNumber(
        event.initialized.royaltyToMarketplaceForTrade,
      ),
      royaltyToMarketplaceForMint: safeUnwrapToNumber(
        event.initialized.royaltyToMarketplaceForMint,
      ),
    };
  }
}
