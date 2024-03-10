import { useSubscription } from '@apollo/client';

import { COLLECTION_QUERY } from './consts';

function useCollection(id: string, owner: string) {
  const { data, loading } = useSubscription(COLLECTION_QUERY, { variables: { id, owner } });

  const collection = data?.collectionById;
  const isCollectionQueryReady = !loading;

  return { collection, isCollectionQueryReady };
}

export { useCollection };
