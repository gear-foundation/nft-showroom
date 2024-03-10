import { useSubscription } from '@apollo/client';

import { COLLECTIONS_QUERY, NFTS_QUERY } from './consts';

function useCollections(admin: string) {
  const { data, loading } = useSubscription(COLLECTIONS_QUERY, { variables: { admin } });

  const collections = data?.collections;
  const isCollectionsQueryReady = !loading;

  return { collections, isCollectionsQueryReady };
}

function useNFTs(owner: string) {
  const { data, loading } = useSubscription(NFTS_QUERY, { variables: { owner } });

  const nfts = data?.nfts;
  const isNFTsQueryReady = !loading;

  return { nfts, isNFTsQueryReady };
}

export { useNFTs, useCollections };
