import { useSubscription } from 'urql';

import { COLLECTION_QUERY } from './consts';

function useCollection(id: string, owner: string) {
  const [result] = useSubscription({ query: COLLECTION_QUERY, variables: { id, owner } });

  const collection = result.data?.collectionById;
  const isCollectionQueryReady = !result.fetching;

  return { collection, isCollectionQueryReady };
}

export { useCollection };
