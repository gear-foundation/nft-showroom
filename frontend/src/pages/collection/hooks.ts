import { useQuery } from '@apollo/client';

import { COLLECTION_QUERY } from './consts';

function useCollection(id: string) {
  const { data } = useQuery(COLLECTION_QUERY, { variables: { id } });
  const collection = data?.collectionById;

  return collection;
}

export { useCollection };
