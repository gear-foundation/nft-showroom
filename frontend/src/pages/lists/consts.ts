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
      }
      mediaUrl
      idInCollection
      owner
    }
  }
`);

export { COLLECTIONS_QUERY, NFTS_QUERY };
