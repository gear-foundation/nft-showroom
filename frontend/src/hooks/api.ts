import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { useMarketplace } from '@/context';

import { useSendMessageWithReply } from './use-send-message-with-reply';

function useMarketplaceMessage() {
  const { marketplace, marketplaceMetadata } = useMarketplace();
  // TODO: drop after @gear-js/react-hooks update
  const address = (marketplace?.address || '0x00') as HexString;

  return useSendMessageWithReply(address, marketplaceMetadata);
}

function useCollectionMessage(id: string, typeName: string) {
  const { collectionsMetadata } = useMarketplace();

  return useSendMessageWithReply(id as HexString, collectionsMetadata?.[typeName]);
}

function useApproveMessage(collectionId: string, collectionTypeName: string) {
  const alert = useAlert();

  const { marketplace } = useMarketplace();
  const sendMessage = useCollectionMessage(collectionId, collectionTypeName);

  return (tokenId: number, _onSuccess: () => void, onError: () => void) => {
    if (!marketplace) throw new Error('Marketplace config is not initialized');

    const to = marketplace.address;
    const payload = { Approve: { to, tokenId } };

    const onSuccess = () => {
      alert.success('NFT is approved to Marketplace contract');
      _onSuccess();
    };

    sendMessage({ payload, onSuccess, onError });
  };
}

export { useMarketplaceMessage, useCollectionMessage, useApproveMessage };
