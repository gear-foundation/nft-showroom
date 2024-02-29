import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { useMarketplace } from '@/context';
import { StartAuctionPayload, StartSalePayload } from '@/features/marketplace';

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

function useApprovedMessage(collectionId: string, collectionTypeName: string) {
  const alert = useAlert();

  const { marketplace } = useMarketplace();
  // TODO: drop after @gear-js/react-hooks update
  const address = (marketplace?.address || '0x00') as HexString;

  const sendMarketplaceMessage = useMarketplaceMessage();
  const sendCollectionMessage = useCollectionMessage(collectionId, collectionTypeName);

  return <T extends StartAuctionPayload | StartSalePayload>(args: {
    payload: T;
    onSuccess: () => void;
    onFinally: () => void;
  }) => {
    const to = address;

    const [{ tokenId }] = Object.values(args.payload) as unknown as
      | StartAuctionPayload[keyof StartAuctionPayload][]
      | StartSalePayload[keyof StartSalePayload][];

    const payload = { Approve: { to, tokenId } };

    const onSuccess = () => {
      alert.success('NFT is approved to Marketplace contract');
      sendMarketplaceMessage(args);
    };

    const onFinally = args.onFinally;

    sendCollectionMessage({ payload, onSuccess, onFinally });
  };
}

export { useMarketplaceMessage, useCollectionMessage, useApprovedMessage };
