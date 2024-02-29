import { useAccount } from '@gear-js/react-hooks';
import { useQuery } from 'urql';

import { useMarketplace } from '@/context';
import { useCountdown } from '@/hooks';

import { LAST_CREATED_COLLECTION_QUERY } from './consts';

function useLastCollection() {
  const { account } = useAccount();
  const admin = account?.decodedAddress || '';

  const [result] = useQuery({ query: LAST_CREATED_COLLECTION_QUERY, variables: { admin } });

  const lastCollection = result.data?.collections[0];
  const isLastCollectionReady = !result.fetching;

  return { lastCollection, isLastCollectionReady };
}

function useCreateCountdown() {
  const { marketplace } = useMarketplace();
  const { config } = marketplace || {};
  const msBetweenCollections = Number(config?.timeBetweenCreateCollections || '0');

  const { lastCollection, isLastCollectionReady } = useLastCollection();
  const lastCollectionTimestamp = new Date(lastCollection?.createdAt || 0).getTime();

  const potentialCreateTimestamp = lastCollectionTimestamp + msBetweenCollections;
  return useCountdown(isLastCollectionReady ? potentialCreateTimestamp : undefined);
}

export { useCreateCountdown };
