import { useQuery } from 'urql';

import { NFT_QUERY } from './consts';

function useNFT(collectionId: string, idInCollection: string) {
  const id = `${collectionId}-${idInCollection}`;
  const [result] = useQuery({ query: NFT_QUERY, variables: { id } });

  return result.data?.nftById;
}

export { useNFT };
