import { HexString } from '@gear-js/api';
import { useReadFullState, useSendMessageHandler } from '@gear-js/react-hooks';

import { useCollectionMetadata } from '@/features/marketplace';

import { CollectionState } from './types';

function useCollection(collectionId: HexString) {
  const metadata = useCollectionMetadata(collectionId);
  const { state } = useReadFullState<CollectionState>(collectionId, metadata, 'All');

  return state?.All;
}

function useCollectionSendMessage(collectionId: HexString) {
  const metadata = useCollectionMetadata(collectionId);

  return useSendMessageHandler(collectionId, metadata);
}

export { useCollection, useCollectionSendMessage };
