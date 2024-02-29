import { graphql } from '@/graphql';

const COLLECTIONS_QUERY = graphql(`
  subscription CollectionsQuery($admin: String!) {
    collections(where: { admin_contains: $admin }) {
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
  subscription NFTsQuery($owner: String!) {
    nfts(where: { owner_contains: $owner }) {
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

export { COLLECTIONS_QUERY, NFTS_QUERY };
