import { graphql } from '@/graphql';

const COLLECTIONS_QUERY = graphql(`
  query CollectionsQuery {
    collections {
      collectionBanner
      collectionLogo
      id
      name
      nfts {
        id
        mediaUrl
      }
      description
      admin
      tokensLimit
    }
  }
`);

const NFTS_QUERY = graphql(`
  query NFTsQuery {
    nfts {
      id
      name
      collection {
        name
        id
        transferable
        sellable
      }
      mediaUrl
      idInCollection
      owner
      sales(where: { status_eq: "open" }) {
        price
      }
      auctions(where: { status_eq: "open" }) {
        minPrice
        timestamp
      }
    }
  }
`);

export { COLLECTIONS_QUERY, NFTS_QUERY };
