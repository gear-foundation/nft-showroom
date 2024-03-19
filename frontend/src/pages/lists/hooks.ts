import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo } from 'react';

import { NftWhereInput } from '@/graphql/graphql';

import {
  COLLECTIONS_CONNECTION_QUERY,
  DEFAULT_VARIABLES,
  NFTS_CONNECTION_QUERY,
  NFTS_QUERY,
  NFTS_SUBSCRIPTION,
} from './consts';
import { getCollectionFilters, getNftFilters } from './utils';

function useCollections(admin: string) {
  const where = useMemo(() => getCollectionFilters(admin), [admin]);

  // not using subscription cuz there are no interactions with collection cards
  const { data, loading, fetchMore } = useQuery(COLLECTIONS_CONNECTION_QUERY, {
    variables: { ...DEFAULT_VARIABLES.COLLECTIONS, where },
  });

  const connection = data?.collectionsConnection;
  const { pageInfo, totalCount, edges } = connection || { totalCount: 0 };
  const { hasNextPage, endCursor } = pageInfo || {};

  const collections = edges?.map(({ node }) => node) || [];

  const isReady = !loading;
  const hasMore = Boolean(hasNextPage);

  const fetchCollections = useCallback(() => {
    if (!endCursor) throw new Error('Cursor to end of the list is not defined');

    fetchMore({ variables: { after: endCursor } }).catch(console.error);
  }, [endCursor, fetchMore]);

  return [collections, totalCount, hasMore, isReady, fetchCollections] as const;
}

function useTotalNFTsCount(where: NftWhereInput) {
  const { data, loading } = useQuery(NFTS_CONNECTION_QUERY, { variables: { where } });

  const totalCount = data?.nftsConnection?.totalCount || 0;

  return [totalCount, !loading] as const;
}

function useNFTs(owner: string, collectionId?: string) {
  const where = useMemo(() => getNftFilters(owner, collectionId), [owner, collectionId]);
  const [totalCount, isTotalCountReady] = useTotalNFTsCount(where);

  const { data, loading, fetchMore, subscribeToMore } = useQuery(NFTS_QUERY, {
    variables: { ...DEFAULT_VARIABLES.NFTS, where },
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
    // maybe would be better to use connection's cursor pagination?
    const unsubscribe = subscribeToMore({
      document: NFTS_SUBSCRIPTION,
      variables: { limit, offset, where },
      updateQuery: (prev = { nfts: [] }, { subscriptionData }) => {
        // extracting newly minted nfts, merge type policy should handle the rest
        if (!subscriptionData.data) return { nfts: [] };

        // important to preserve consistent sorting of nfts, otherwise results will be inaccurate
        const mintedNfts = subscriptionData.data.nfts.filter(
          (subNft) => !prev.nfts.some((nft) => nft.id === subNft.id),
        );

        return { nfts: [...mintedNfts, ...prev.nfts] };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore, nftsCount, where]);

  const fetchNFTs = useCallback(() => {
    const offset = nftsCount;

    fetchMore({ variables: { offset } }).catch(console.error);
  }, [fetchMore, nftsCount]);

  return [nfts, totalCount, hasMoreNFTs, isNFTsQueryReady, fetchNFTs] as const;
}

export { useNFTs, useCollections };
