import { useQuery } from 'urql';

import { COLLECTION_TYPES_QUERY } from './consts';

function useCollectionTypes() {
  const [result] = useQuery({ query: COLLECTION_TYPES_QUERY });

  return result?.data?.collectionTypes;
}

export { useCollectionTypes };
