import { useSubscription } from '@apollo/client';

import { NFT_QUERY } from './consts';

function useNFT(collectionId: string, idInCollection: string) {
  const id = `${collectionId}-${idInCollection}`;
  const { data } = useSubscription(NFT_QUERY, { variables: { id } });

  return data?.nftById;
}

export { useNFT };
