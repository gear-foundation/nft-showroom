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

type CollectionsState = {
  AllCollections: CollectionToOwner[];
};

type CollectionState = {
  All: {
    tokens: [
      string,
      {
        owner: HexString;
        name: string;
        description: string;
        metadata: unknown[];
        mediaUrl: string;
        mintTime: string;
      },
    ][];
    owners: unknown[];
    tokenApprovals: unknown[];
    config: {
      name: string;
      description: string;
      collectionTags: string[];
      collectionBanner: string;
      collectionLogo: string;
      userMintLimit: null;
      additionalLinks: {
        externalUrl: string | null;
        telegram: string | null;
        xcom: string | null;
        medium: string | null;
        discord: string | null;
      } | null;
      royalty: string;
      paymentForMint: string;
      transferable: string | null;
      sellable: string | null;
    };
    nonce: string;
    imgLinksAndData: [
      string,
      {
        limitCopies: string | null;
        autoChangingRules: string | null;
      },
    ][];
    collectionOwner: HexString;
    totalNumberOfTokens: string | null;
  };
};

export type { MarketplaceState, CollectionsState, CollectionState };
