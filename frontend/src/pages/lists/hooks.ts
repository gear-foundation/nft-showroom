import { useQuery } from '@apollo/client';
import { useCallback, useEffect } from 'react';

import { COLLECTIONS_CONNECTION_QUERY, NFTS_CONNECTION_QUERY, NFTS_QUERY, NFTS_SUBSCRIPTION } from './consts';

const DEFAULT_COLLECTIONS_VARIABLES = {
  first: 12,
  after: null,
};

function useCollections(admin: string) {
  // not using subscription cuz there are no interactions with collection cards
  const { data, loading, fetchMore } = useQuery(COLLECTIONS_CONNECTION_QUERY, {
    variables: { ...DEFAULT_COLLECTIONS_VARIABLES, admin },
  });

  const connection = data?.collectionsConnection;
  const { pageInfo, totalCount, edges } = connection || { totalCount: 0 };
  const { hasNextPage, endCursor } = pageInfo || {};

  const collections = edges?.map(({ node }) => node) || [];

  const isReady = !loading;
  const hasMore = Boolean(hasNextPage);
  console.log('hasMore: ', hasMore);

  const fetchCollections = useCallback(() => {
    if (!endCursor) throw new Error('Cursor to end of the list is not defined');

    fetchMore({ variables: { after: endCursor } }).catch(console.error);
  }, [endCursor, fetchMore]);

  return [collections, totalCount, hasMore, isReady, fetchCollections] as const;
}

const DEFAULT_NFTS_VARIABLES = {
  limit: 16,
  offset: 0,
};

function useTotalNFTsCount(collectionId: string, owner: string) {
  const { data, loading } = useQuery(NFTS_CONNECTION_QUERY, { variables: { collectionId, owner } });

  const totalCount = data?.nftsConnection?.totalCount || 0;

  return [totalCount, !loading] as const;
}

function useNFTs(collectionId: string, owner: string) {
  const [totalCount, isTotalCountReady] = useTotalNFTsCount(collectionId, owner);

  const { data, loading, fetchMore, subscribeToMore } = useQuery(NFTS_QUERY, {
    variables: { ...DEFAULT_NFTS_VARIABLES, collectionId, owner },
  });

  const nfts = data?.nfts || [];
  const nftsCount = nfts.length;

  // TODO: if new nfts would be minted, totalCount will remain the same
  const hasMoreNFTs = totalCount && nftsCount ? nftsCount < totalCount : false;
  const isNFTsQueryReady = !loading && isTotalCountReady;

  useEffect(() => {
    const limit = nftsCount;
    const offset = 0;

    if (!limit) return;

    // kinda tricky subscription to handle live interaction,
    // works for now, but worth to reconsider them later.
    // + would be better to use connection's cursor pagination
    const unsubscribe = subscribeToMore({
      document: NFTS_SUBSCRIPTION,
      variables: { limit, offset, collectionId, owner },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore, collectionId, owner, nftsCount]);

  const fetchNFTs = useCallback(() => {
    const offset = nftsCount;

    fetchMore({ variables: { offset } }).catch(console.error);
  }, [fetchMore, nftsCount]);

  return [nfts, totalCount, hasMoreNFTs, isNFTsQueryReady, fetchNFTs] as const;
}

export { useNFTs, useCollections };
