import { HexString } from '@gear-js/api';
import { useQuery } from 'urql';

import { NFT_QUERY } from './consts';

function useNFT(collectionId: HexString, idInCollection: string) {
  const id = `${collectionId}-${idInCollection}`;
  const [result] = useQuery({ query: NFT_QUERY, variables: { id } });

  return result.data?.nftById;
}

export { useNFT };
