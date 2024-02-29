import { graphql } from '@/graphql';

const DEFAULT_VALUE = {
  marketplace: undefined,
  marketplaceMetadata: undefined,
  collectionsMetadata: undefined,
};

const MARKETPLACE_QUERY = graphql(`
  query MarketplaceQuery {
    marketplaceById(id: "1") {
      address
      collectionTypes {
        description
        metaUrl
        type
      }
      metadata
      config {
        feePerUploadedFile
        minimumValueForTrade
        royaltyToMarketplaceForMint
        royaltyToMarketplaceForTrade
        timeBetweenCreateCollections
      }
      admins
    }
  }
`);

export { DEFAULT_VALUE, MARKETPLACE_QUERY };
