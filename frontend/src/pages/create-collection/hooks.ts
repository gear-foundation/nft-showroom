import { useAccount } from '@gear-js/react-hooks';
import { useQuery } from 'urql';

import { useMarketplace } from '@/context';
import { useCountdown } from '@/hooks';

import { LAST_CREATED_COLLECTION_QUERY } from './consts';

function useLastCollection() {
  const { account } = useAccount();
  const admin = account?.decodedAddress || '';

  const [result] = useQuery({
    query: LAST_CREATED_COLLECTION_QUERY,
    variables: { admin },
    // TODO: better to use cache-and-network, but result.fetching is not getting updated immediately
    // maybe should be easy to fix via result.stale
    // ref: https://github.com/urql-graphql/urql/issues/2002
    requestPolicy: 'network-only',
  });

  const lastCollection = result.data?.collections[0];
  const isLastCollectionReady = !result.fetching;

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
