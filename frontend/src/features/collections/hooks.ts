import { HexString } from '@gear-js/api';
import { useSendMessageHandler } from '@gear-js/react-hooks';
import { useQuery } from 'urql';

import { useCollectionMetadata } from '@/features/marketplace';

import { COLLECTION_QUERY } from './consts';

function useCollection(id: HexString) {
  const [result] = useQuery({ query: COLLECTION_QUERY, variables: { id } });

  return result.data?.collectionById;
}

function useCollectionSendMessage(collectionId: HexString) {
  const metadata = useCollectionMetadata(collectionId);

  return useSendMessageHandler(collectionId, metadata);
}

export { useCollection, useCollectionSendMessage };
