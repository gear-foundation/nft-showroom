import { useAccount } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

import { ADDRESS } from '@/consts';
import { useMarketplace } from '@/context';
import { useCountdown } from '@/hooks';

import { LAST_CREATED_COLLECTION_QUERY } from './consts';

function useLastCollection() {
  const { account } = useAccount();
  const admin = account?.decodedAddress || '';

  const { data, isFetching } = useQuery({
    queryKey: ['lastCreatedCollection', admin],
    queryFn: () => request(ADDRESS.INDEXER, LAST_CREATED_COLLECTION_QUERY, { admin }),
  });

  const lastCollection = data?.collections[0];
  const isLastCollectionReady = !isFetching;

  return { lastCollection, isLastCollectionReady };
}

function useCreateCountdown() {
  const { marketplace } = useMarketplace();
  const { config, admins } = marketplace || {};
  const isConfigReady = Boolean(config);
  const msBetweenCollections = Number(config?.timeBetweenCreateCollections || '0');

  const { account } = useAccount();
  const isAdmin = admins?.includes(account?.decodedAddress || '');

  const { lastCollection, isLastCollectionReady } = useLastCollection();
  const lastCollectionTimestamp = new Date(lastCollection?.createdAt || 0).getTime();

  // TODO: no need for a countdown and it's requests at all if the user is an admin
  const potentialCreateTimestamp = isAdmin ? 0 : lastCollectionTimestamp + msBetweenCollections;

  return useCountdown(isLastCollectionReady && isConfigReady ? potentialCreateTimestamp : undefined);
}

export { useCreateCountdown };
