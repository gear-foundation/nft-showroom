import { HexString } from '@gear-js/api';
import { useSendMessageHandler } from '@gear-js/react-hooks';

import { useCollectionMetadata } from '@/features/marketplace';

function useCollectionSendMessage(collectionId: HexString) {
  const metadata = useCollectionMetadata(collectionId);

  return useSendMessageHandler(collectionId, metadata);
}

export { useCollectionSendMessage };
