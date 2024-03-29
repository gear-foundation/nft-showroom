import { useQuery } from '@apollo/client';
import { useAccount } from '@gear-js/react-hooks';

import { useMarketplace } from '@/context';
import { useCountdown } from '@/hooks';

import { LAST_CREATED_COLLECTION_QUERY } from './consts';

function useLastCollection() {
  const { account } = useAccount();
  const admin = account?.decodedAddress || '';

  const { data, loading } = useQuery(LAST_CREATED_COLLECTION_QUERY, { variables: { admin } });

  const lastCollection = data?.collections[0];
  const isLastCollectionReady = !loading;

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
