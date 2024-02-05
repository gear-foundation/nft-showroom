import { HexString } from '@gear-js/api';
import { useQuery } from 'urql';

import { COLLECTION_QUERY } from './consts';

function useCollection(id: HexString) {
  const [result] = useQuery({ query: COLLECTION_QUERY, variables: { id } });

  return result.data?.collectionById;
}

export { useCollection };
