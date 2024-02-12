import { useSubscription } from 'urql';

import { COLLECTIONS_QUERY, NFTS_QUERY } from './consts';

function useCollections() {
  const [result] = useSubscription({ query: COLLECTIONS_QUERY });

  return result.data?.collections;
}

function useNFTs() {
  const [result] = useSubscription({ query: NFTS_QUERY });

  return result.data?.nfts;
}

export { useNFTs, useCollections };
