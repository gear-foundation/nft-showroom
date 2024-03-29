import { useQuery } from '@apollo/client';

import { NFT_QUERY } from './consts';

function useNFT(collectionId: string, idInCollection: string) {
  const id = `${collectionId}-${idInCollection}`;
  const { data } = useQuery(NFT_QUERY, { variables: { id }, pollInterval: 10000 });

  return data?.nftById;
}

export { useNFT };
