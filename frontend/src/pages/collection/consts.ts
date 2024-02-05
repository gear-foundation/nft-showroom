import { graphql } from '@/graphql';

const COLLECTION_QUERY = graphql(`
  query CollectionQuery($id: String!) {
    collectionById(id: $id) {
      admin
      collectionBanner
      collectionLogo
      description
      id
      name
      tokensLimit
      paymentForMint
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
  }
`);

export { COLLECTION_QUERY };
