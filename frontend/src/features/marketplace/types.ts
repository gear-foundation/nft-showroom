import { HexString } from '@gear-js/api';

type CollectionId = HexString;
type OwnerId = HexString;
type CollectionTypeName = string;

type CollectionToOwner = [CollectionId, [CollectionTypeName, OwnerId]];

type CollectionType = [CollectionTypeName, { codeId: HexString; metaLink: string; typeDescription: string }];

type Sale = {
  price: string;
  tokenOwner: HexString;
  collectionOwner: HexString;
  royalty: string;
};

type Auction = {
  owner: HexString;
  startedAt: string;
  endedAt: string;
  currentPrice: string;
  currentWinner: HexString;
  collectionOwner: HexString;
  royalty: string;
};

type MarketplaceState = {
  All: {
    collectionToOwner: CollectionToOwner[];
    typeCollections: CollectionType[];
    sales: [[HexString, string], Sale][];
    auctions: [[HexString, string], Auction][];
  };
};

type CollectionIDsState = {
  AllCollections: CollectionToOwner[];
};

type CollectionState = {
  CollectionInfo: {
    owner: HexString;
    typeName: string;
    metaLink: string;
  };
};

export type { MarketplaceState, CollectionIDsState, CollectionState };
