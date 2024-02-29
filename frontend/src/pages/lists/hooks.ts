import { useSubscription } from 'urql';

import { COLLECTIONS_QUERY, NFTS_QUERY } from './consts';

function useCollections(admin: string) {
  const [result] = useSubscription({ query: COLLECTIONS_QUERY, variables: { admin } });

  const collections = result.data?.collections;
  const isCollectionsQueryReady = !result.fetching;

  return { collections, isCollectionsQueryReady };
}

function useNFTs(owner: string) {
  const [result] = useSubscription({ query: NFTS_QUERY, variables: { owner } });

  const nfts = result.data?.nfts;
  const isNFTsQueryReady = !result.fetching;

  return { nfts, isNFTsQueryReady };
}

export { useNFTs, useCollections };
