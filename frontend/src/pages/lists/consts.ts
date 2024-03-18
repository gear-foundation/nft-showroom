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
  query NFTsConnectionQuery($collectionId: String!, $owner: String!) {
    nftsConnection(
      orderBy: createdAt_DESC
      where: { owner_contains: $owner, collection: { id_contains: $collectionId } }
    ) {
      totalCount
    }
  }
`);

// mintedBy used in a collection page, collection used in a lists page
const NFTS_QUERY = graphql(`
  query NFTsQuery($collectionId: String!, $limit: Int!, $offset: Int!, $owner: String!) {
    nfts(
      limit: $limit
      offset: $offset
      orderBy: createdAt_DESC
      where: { owner_contains: $owner, collection: { id_contains: $collectionId } }
    ) {
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
  subscription NFTsSubscription($collectionId: String!, $limit: Int!, $offset: Int!, $owner: String!) {
    nfts(
      limit: $limit
      offset: $offset
      orderBy: createdAt_DESC
      where: { owner_contains: $owner, collection: { id_contains: $collectionId } }
    ) {
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

export { COLLECTIONS_CONNECTION_QUERY, NFTS_CONNECTION_QUERY, NFTS_QUERY, NFTS_SUBSCRIPTION };
