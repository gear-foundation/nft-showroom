import { useQuery } from '@apollo/client';

import { COLLECTION_QUERY } from './consts';

function useCollection(id: string) {
  // subscription to handle update in case of newly created collection
  const { data, loading } = useQuery(COLLECTION_QUERY, { variables: { id } });
  const collection = data?.collectionById;
  const isCollectionQueryReady = !loading;

  return [collection, isCollectionQueryReady] as const;
}

export { useCollection };
