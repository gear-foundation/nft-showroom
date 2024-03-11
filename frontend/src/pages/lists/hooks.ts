import { useQuery } from '@apollo/client';
import { useEffect } from 'react';

import { COLLECTIONS_CONNECTION_QUERY, NFTS_QUERY, NFTS_SUBSCRIPTION } from './consts';

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
  const { pageInfo, totalCount, edges } = connection || {};
  const { hasNextPage, endCursor } = pageInfo || {};

  const collections = edges?.map(({ node }) => node) || [];

  const isReady = !loading;
  const hasMore = Boolean(hasNextPage);

  const fetchCollections = () => {
    if (!endCursor) throw new Error('Cursor to end of the list is not defined');

    fetchMore({ variables: { after: endCursor } }).catch(console.error);
  };

  return [collections, totalCount, hasMore, isReady, fetchCollections] as const;
}

const DEFAULT_NFTS_VARIABLES = {
  limit: 16,
  offset: 0,
};

function useNFTs(owner: string) {
  const { data, loading, fetchMore, subscribeToMore } = useQuery(NFTS_QUERY, {
    variables: { ...DEFAULT_NFTS_VARIABLES, owner },
  });

  const nfts = data?.nfts || [];
  const nftsCount = nfts.length;
  const hasMoreNFTs = true;
  const isNFTsQueryReady = !loading;

  const offset = nftsCount;

  useEffect(() => {
    // kinda tricky subscription to handle nfts interaction,
    // works for now, but worth to reconsider them later
    const unsubscribe = subscribeToMore({
      document: NFTS_SUBSCRIPTION,
      variables: { ...DEFAULT_NFTS_VARIABLES, offset, owner },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore, owner, offset]);

  const fetchNFTs = () => fetchMore({ variables: { offset } });

  return [nfts, nftsCount, hasMoreNFTs, isNFTsQueryReady, fetchNFTs] as const;
}

export { useNFTs, useCollections };
