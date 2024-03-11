import { useQuery, useSubscription } from '@apollo/client';
import { useEffect } from 'react';

import { COLLECTIONS_QUERY, NFTS_QUERY, NFTS_SUBSCRIPTION } from './consts';

function useCollections(admin: string) {
  const { data, loading } = useSubscription(COLLECTIONS_QUERY, { variables: { admin } });

  const collections = data?.collections;
  const isCollectionsQueryReady = !loading;

  return { collections, isCollectionsQueryReady };
}

const DEFAULT_VARIABLES = {
  limit: 16,
  offset: 0,
};

function useNFTs(owner: string) {
  const { data, loading, fetchMore, subscribeToMore } = useQuery(NFTS_QUERY, {
    variables: { ...DEFAULT_VARIABLES, owner },
  });

  const nfts = data?.nfts || [];
  const nftsCount = nfts.length;
  const hasMoreNFTs = true;
  const isNFTsQueryReady = !loading;

  const offset = nftsCount;

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: NFTS_SUBSCRIPTION,
      variables: { ...DEFAULT_VARIABLES, offset, owner },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore, owner, offset]);

  const fetchNFTs = () => fetchMore({ variables: { offset } });

  return [nfts, nftsCount, hasMoreNFTs, isNFTsQueryReady, fetchNFTs] as const;
}

export { useNFTs, useCollections };
