import { HexString } from '@gear-js/api';

type CollectionsState = {
  AllCollections: [HexString, HexString][];
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
  };
};

export type { CollectionsState, CollectionState };
