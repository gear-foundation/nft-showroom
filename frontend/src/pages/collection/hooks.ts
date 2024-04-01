import { useAccount } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

import { ADDRESS } from '@/consts';

import { COLLECTION_QUERY } from './consts';

function useCollection(id: string) {
  const { account, isAccountReady } = useAccount();
  const accountAddress = account?.decodedAddress || '';

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['collection', id, accountAddress],
    queryFn: () => request(ADDRESS.INDEXER, COLLECTION_QUERY, { id, accountAddress }),
    enabled: isAccountReady,
  });

  const collection = data?.collectionById;
  const isCollectionQueryReady = !isFetching;

  return [collection, isCollectionQueryReady, refetch] as const;
}

export { useCollection };
