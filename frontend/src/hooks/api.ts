import { HexString } from '@gear-js/api';
import { useSendMessageHandler } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';

import { ADDRESS } from '@/consts';
import { useMetadata } from '@/context';

function useMarketplaceMessage() {
  const { marketplaceMetadata } = useMetadata();

  return useSendMessageHandler(ADDRESS.CONTRACT, marketplaceMetadata);
}

function useCollectionMessage(id: string, typeId: string) {
  const { collectionsMetadata } = useMetadata();

  return useSendMessageHandler(id as HexString, collectionsMetadata?.[typeId]);
}

function useApprovedMessage(collectionId: string, collectionTypeId: string) {
  const sendMarketplaceMessage = useMarketplaceMessage();
  const sendCollectionMessage = useCollectionMessage(collectionId, collectionTypeId);

  return (args: {
    payload: Record<string, Record<'tokenId', string> | Record<string, AnyJson>>;
    onSuccess: () => void;
  }) => {
    const to = ADDRESS.CONTRACT;
    const [{ tokenId }] = Object.values(args.payload);

    const payload = { Approve: { to, tokenId } };
    const onSuccess = () => sendMarketplaceMessage(args);

    sendCollectionMessage({ payload, onSuccess });
  };
}

export { useMarketplaceMessage, useCollectionMessage, useApprovedMessage };
