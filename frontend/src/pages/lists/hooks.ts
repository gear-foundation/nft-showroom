import { useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';

import { CollectionWhereInput, NftWhereInput } from '@/graphql/graphql';

import {
  COLLECTIONS_CONNECTION_QUERY,
  COLLECTIONS_NFTS_COUNT_QUERY,
  COLLECTIONS_QUERY,
  DEFAULT_VARIABLES,
  NFTS_CONNECTION_QUERY,
  NFTS_QUERY,
} from './consts';
import { getCollectionFilters, getNftFilters } from './utils';

function useCollectionsNFTsCount(ids: string[]) {
  const { data } = useQuery(COLLECTIONS_NFTS_COUNT_QUERY, { variables: { ids }, skip: !ids.length });

  return data?.nftsInCollection || [];
}

function useTotalCollectionsCount(where: CollectionWhereInput) {
  const { data, loading } = useQuery(COLLECTIONS_CONNECTION_QUERY, {
    variables: { ...DEFAULT_VARIABLES.COLLECTIONS, where },
  });

  const totalCount = data?.collectionsConnection.totalCount || 0;

  return [totalCount, !loading] as const;
}

function useCollections(admin: string) {
  const where = useMemo(() => getCollectionFilters(admin), [admin]);
  const [totalCount, isTotalCountReady] = useTotalCollectionsCount(where);

  const { data, loading, fetchMore } = useQuery(COLLECTIONS_QUERY, {
    variables: { ...DEFAULT_VARIABLES.COLLECTIONS, where },
  });

  const collections = useMemo(() => data?.collections || [], [data]);
  const collectionsCount = collections.length;

  const collectionIds = useMemo(() => collections.map(({ id }) => id), [collections]);
  const nftsCounts = useCollectionsNFTsCount(collectionIds);

  const collectionsWithCounts = useMemo(() => {
    return collections.map((collection) => {
      const nftsCount = nftsCounts.find(({ collection: id }) => collection.id === id)?.count;

      return { ...collection, nftsCount };
    });
  }, [collections, nftsCounts]);

  const isReady = !loading && isTotalCountReady;
  const hasMore = totalCount && collectionsCount ? collectionsCount < totalCount : false;

  const fetchCollections = useCallback(() => {
    const offset = collectionsCount;

    fetchMore({ variables: { offset } }).catch(console.error);
  }, [collectionsCount, fetchMore]);

  return [collectionsWithCounts, totalCount, hasMore, isReady, fetchCollections] as const;
}

function useTotalNFTsCount(where: NftWhereInput) {
  const { data, loading } = useQuery(NFTS_CONNECTION_QUERY, { variables: { where } });

  const totalCount = data?.nftsConnection?.totalCount || 0;

  return [totalCount, !loading] as const;
}

function useNFTs(owner: string, collectionId?: string) {
  const where = useMemo(() => getNftFilters(owner, collectionId), [owner, collectionId]);
  const [totalCount, isTotalCountReady] = useTotalNFTsCount(where);

  const { data, loading, fetchMore, refetch } = useQuery(NFTS_QUERY, {
    variables: { ...DEFAULT_VARIABLES.NFTS, where },
  });

  const nfts = data?.nfts || [];
  const nftsCount = nfts.length;

  // TODO: if new nfts would be minted, totalCount will remain the same
  const hasMoreNFTs = totalCount && nftsCount ? nftsCount < totalCount : false;
  const isNFTsQueryReady = !loading && isTotalCountReady;

  const fetchNFTs = useCallback(() => {
    const offset = nftsCount;

    fetchMore({ variables: { offset } }).catch(console.error);
  }, [fetchMore, nftsCount]);

  return [nfts, totalCount, hasMoreNFTs, isNFTsQueryReady, fetchNFTs, refetch] as const;
}

export { useNFTs, useCollections };
