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
        id
        royalty
        name
        sellable
        transferable
        type {
          id
        }
      }
      name
      description
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

export { NFT_QUERY };
