import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { useMemo } from 'react';

import { ADDRESS } from '@/consts';
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
  const { data } = useQuery({
    queryKey: ['collectionsNFTsCount', ids],
    queryFn: () => request(ADDRESS.INDEXER, COLLECTIONS_NFTS_COUNT_QUERY, { ids }),
    enabled: Boolean(ids.length),
  });

  return data?.nftsInCollection || [];
}

function useTotalCollectionsCount(where: CollectionWhereInput) {
  const { data, isFetching } = useQuery({
    queryKey: ['collectionsCount', where],
    queryFn: () => request(ADDRESS.INDEXER, COLLECTIONS_CONNECTION_QUERY, { ...DEFAULT_VARIABLES.COLLECTIONS, where }),
  });

  const isReady = !isFetching;
  const totalCount = data?.collectionsConnection.totalCount || 0;

  return [totalCount, isReady] as const;
}

function useCollections(admin: string) {
  const where = useMemo(() => getCollectionFilters(admin), [admin]);
  const [totalCount, isTotalCountReady] = useTotalCollectionsCount(where);

  const { data, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ['collections', admin],
    queryFn: ({ pageParam: offset }) =>
      request(ADDRESS.INDEXER, COLLECTIONS_QUERY, { ...DEFAULT_VARIABLES.COLLECTIONS, offset, where }),
    initialPageParam: 0,
    // TODO: take a look, works for now cuz counter and hasMore are calculated below
    getNextPageParam: (_lastPage, pages) => DEFAULT_VARIABLES.COLLECTIONS.limit * pages.length,
  });

  const collections = useMemo(() => data?.pages.flatMap((result) => result.collections) || [], [data]);
  const collectionsCount = collections.length;

  const collectionIds = useMemo(() => collections.map(({ id }) => id), [collections]);
  const nftsCounts = useCollectionsNFTsCount(collectionIds);

  const collectionsWithCounts = useMemo(() => {
    return collections.map((collection) => {
      const nftsCount = nftsCounts.find(({ collection: id }) => collection.id === id)?.count;

      return { ...collection, nftsCount };
    });
  }, [collections, nftsCounts]);

  const isReady = !isFetching && isTotalCountReady;
  const hasMore = totalCount && collectionsCount ? collectionsCount < totalCount : false;

  return [collectionsWithCounts, totalCount, hasMore, isReady, fetchNextPage] as const;
}

function useTotalNFTsCount(where: NftWhereInput) {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['nftsCount', where],
    queryFn: () => request(ADDRESS.INDEXER, NFTS_CONNECTION_QUERY, { where }),
  });

  const isReady = !isFetching;
  const totalCount = data?.nftsConnection?.totalCount || 0;

  return [totalCount, isReady, refetch] as const;
}

function useNFTs(owner: string, collectionId: string | undefined, searchQuery?: string) {
  const where = useMemo(() => getNftFilters(owner, collectionId, searchQuery), [owner, collectionId, searchQuery]);
  const [totalCount, isTotalCountReady, refetchTotalNFTsCount] = useTotalNFTsCount(where);

  const { data, isFetching, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['nfts', where],
    queryFn: ({ pageParam: offset }) =>
      request(ADDRESS.INDEXER, NFTS_QUERY, { ...DEFAULT_VARIABLES.NFTS, offset, where }),
    initialPageParam: 0,
    // TODO: take a look, works for now cuz counter and hasMore are calculated below
    getNextPageParam: (_lastPage, pages) => DEFAULT_VARIABLES.NFTS.limit * pages.length,
  });

  const nfts = useMemo(() => data?.pages.flatMap((result) => result.nfts) || [], [data]);
  const nftsCount = nfts.length;

  // TODO: if new nfts would be minted, totalCount will remain the same
  const hasMoreNFTs = totalCount && nftsCount ? nftsCount < totalCount : false;
  const isNFTsQueryReady = !isFetching && isTotalCountReady;

  const refetchNFTs = () => Promise.all([refetch(), refetchTotalNFTsCount()]);

  return [nfts, totalCount, hasMoreNFTs, isNFTsQueryReady, fetchNextPage, refetchNFTs] as const;
}

export { useNFTs, useCollections };
