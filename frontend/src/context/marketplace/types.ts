import { Maybe } from 'graphql/jsutils/Maybe';

type Marketplace = {
  address: string;
  metadata: string;
  collectionTypes: {
    description: string;
    metaUrl: string;
    type: string;
  }[];
  config: {
    feePerUploadedFile: string;
    minimumValueForTrade: string;
    royaltyToMarketplaceForMint: number;
    royaltyToMarketplaceForTrade: number;
    timeBetweenCreateCollections: string;
  };
  admins: string[];
};

type Value = {
  marketplace: Maybe<Marketplace> | undefined;
};

export type { Value };
