import { useSubscription } from 'urql';

import { COLLECTION_QUERY } from './consts';

function useCollection(id: string) {
  const [result] = useSubscription({ query: COLLECTION_QUERY, variables: { id } });

  return result.data?.collectionById;
}

export { useCollection };
