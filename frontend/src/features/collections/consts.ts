import { graphql } from '@/graphql';

const MINTED_NFTS_QUERY = graphql(`
  query MintedNFTsQuery($id: String!, $accountAddress: String!) {
    collectionById(id: $id) {
      nfts(where: { mintedBy_eq: $accountAddress }) {
        id
      }
    }
  }
`);

export { MINTED_NFTS_QUERY };
