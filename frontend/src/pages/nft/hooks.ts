import { useSubscription } from 'urql';

import { NFT_QUERY } from './consts';

function useNFT(collectionId: string, idInCollection: string) {
  const id = `${collectionId}-${idInCollection}`;
  const [result] = useSubscription({ query: NFT_QUERY, variables: { id } });

  return result.data?.nftById;
}

export { useNFT };
