import { graphql } from '@/graphql';

const COLLECTIONS_QUERY = graphql(`
  query CollectionsQuery {
    collections {
      id
      name
      description
      collectionBanner
      collectionLogo
      admin
      tokensLimit

      nfts {
        id
        mediaUrl
      }
    }
  }
`);

const NFTS_QUERY = graphql(`
  query NFTsQuery {
    nfts {
      id
      idInCollection
      name
      mediaUrl
      owner

      collection {
        id
        name
        transferable
        sellable
      }

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
