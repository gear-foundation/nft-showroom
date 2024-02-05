import { graphql } from '@/graphql';

const NFT_QUERY = graphql(`
  query NFTQuery($id: String!) {
    nftById(id: $id) {
      idInCollection
      mediaUrl
      id
      owner
      createdAt
      collection {
        royalty
        name
        sellable
        transferable
      }
      name
      description
    }
  }
`);

export { NFT_QUERY };
