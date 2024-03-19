import { graphql } from '@/graphql';

const COLLECTIONS_CONNECTION_QUERY = graphql(`
  query CollectionsConnectionQuery($first: Int!, $after: String, $where: CollectionWhereInput!) {
    collectionsConnection(orderBy: [createdAt_DESC, name_DESC, id_DESC], first: $first, after: $after, where: $where) {
      pageInfo {
        hasNextPage
        endCursor
      }

      totalCount

      edges {
        node {
          id
          name
          description
          collectionBanner
          collectionLogo
          admin
          tokensLimit

          nfts(limit: 5) {
            id
            mediaUrl
          }
        }
      }
    }
  }
`);

const NFTS_CONNECTION_QUERY = graphql(`
  query NFTsConnectionQuery($where: NftWhereInput!) {
    nftsConnection(orderBy: [createdAt_DESC, name_DESC, id_DESC], where: $where) {
      totalCount
    }
  }
`);

// mintedBy used in a collection page, collection used in a lists page.
// also, it is important to preserve consistent sorting, so we're using name_DESC and id_DESC in case if createdAt is the same
const NFTS_QUERY = graphql(`
  query NFTsQuery($limit: Int!, $offset: Int!, $where: NftWhereInput!) {
    nfts(limit: $limit, offset: $offset, orderBy: [createdAt_DESC, name_DESC, id_DESC], where: $where) {
      id
      idInCollection
      name
      mediaUrl
      owner

      mintedBy

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
        lastPrice
        endTimestamp
      }
    }
  }
`);

const NFTS_SUBSCRIPTION = graphql(`
  subscription NFTsSubscription($limit: Int!, $offset: Int!, $where: NftWhereInput!) {
    nfts(limit: $limit, offset: $offset, orderBy: [createdAt_DESC, name_DESC, id_DESC], where: $where) {
      id
      idInCollection
      name
      mediaUrl
      owner

      mintedBy

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
        lastPrice
        endTimestamp
      }
    }
  }
`);

const DEFAULT_VARIABLES = {
  COLLECTIONS: {
    first: 12,
    after: null,
  },

  NFTS: {
    limit: 16,
    offset: 0,
  },
};

export { COLLECTIONS_CONNECTION_QUERY, NFTS_CONNECTION_QUERY, NFTS_QUERY, NFTS_SUBSCRIPTION, DEFAULT_VARIABLES };
