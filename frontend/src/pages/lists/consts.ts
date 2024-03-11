import { graphql } from '@/graphql';

const COLLECTIONS_CONNECTION_QUERY = graphql(`
  query CollectionsConnectionQuery($first: Int!, $after: String, $admin: String!) {
    collectionsConnection(orderBy: createdAt_DESC, first: $first, after: $after, where: { admin_contains: $admin }) {
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

          nfts {
            id
            mediaUrl
          }
        }
      }
    }
  }
`);

const NFTS_CONNECTION_QUERY = graphql(`
  query NFTsConnectionQuery($owner: String!) {
    nftsConnection(orderBy: createdAt_DESC, where: { owner_contains: $owner }) {
      totalCount
    }
  }
`);

const NFTS_QUERY = graphql(`
  query NFTsQuery($limit: Int!, $offset: Int!, $owner: String!) {
    nfts(limit: $limit, offset: $offset, orderBy: createdAt_DESC, where: { owner_contains: $owner }) {
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
        lastPrice
        endTimestamp
      }
    }
  }
`);

const NFTS_SUBSCRIPTION = graphql(`
  subscription NFTsSubscription($limit: Int!, $offset: Int!, $owner: String!) {
    nfts(limit: $limit, offset: $offset, orderBy: createdAt_DESC, where: { owner_contains: $owner }) {
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
        lastPrice
        endTimestamp
      }
    }
  }
`);

export { COLLECTIONS_CONNECTION_QUERY, NFTS_CONNECTION_QUERY, NFTS_QUERY, NFTS_SUBSCRIPTION };
