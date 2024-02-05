import { useQuery } from 'urql';

import { COLLECTIONS_QUERY, NFTS_QUERY } from './consts';

function useCollections() {
  const [result] = useQuery({ query: COLLECTIONS_QUERY });

  return result.data?.collections;
}

function useNFTs() {
  const [result] = useQuery({ query: NFTS_QUERY });

  return result.data?.nfts;
}

export { useNFTs, useCollections };
