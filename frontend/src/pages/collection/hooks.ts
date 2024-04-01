import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

import { ADDRESS } from '@/consts';

import { COLLECTION_QUERY } from './consts';

function useCollection(id: string) {
  const { data, isFetching } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => request(ADDRESS.INDEXER, COLLECTION_QUERY, { id }),
  });

  const collection = data?.collectionById;
  const isCollectionQueryReady = !isFetching;

  return [collection, isCollectionQueryReady] as const;
}

export { useCollection };
