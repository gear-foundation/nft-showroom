import { HexString, UserMessageSent } from '@gear-js/api';
import { useAccount, useAlert, useApi, useSendMessageHandler } from '@gear-js/react-hooks';
import { UnsubscribePromise } from '@polkadot/api/types';
import { AnyJson } from '@polkadot/types/types';
import { generatePath, useNavigate } from 'react-router-dom';

import { ADDRESS, ROUTE } from '@/consts';
import { useMetadata } from '@/context';

interface MarketplacePayload {
  collectionCreated: {
    collectionAddress: HexString;
  };

  saleNft: unknown;
  nftSold: unknown;
  auctionCreated: unknown;
  bidAdded: unknown;
  auctionClosed: unknown;
}

export interface CollectionPayload {
  transferred: unknown;
  minted: unknown;
  approved: unknown;
}

const SUCCESS_MESSAGE = {
  saleNft: 'NFT is put on sale',
  collectionCreated: 'Collection is created',
  nftSold: 'NFT is sold',
  auctionCreated: 'Auction is created',
  bidAdded: 'Bid is added',
  auctionClosed: 'Auction is closed',
  transferred: 'NFT is transfered',
  minted: 'NFT is minted',
  approved: 'NFT is approved to marketplace contract',
};

const useSendMessageWithReply = (...args: Parameters<typeof useSendMessageHandler>) => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const alert = useAlert();

  const sendMessage = useSendMessageHandler(...args);

  const navigate = useNavigate();

  const getOnSuccess = (payload: MarketplacePayload | CollectionPayload) => {
    const [key] = Object.keys(payload) as (keyof MarketplacePayload | keyof CollectionPayload)[];

    switch (key) {
      case 'collectionCreated': {
        const _payload = payload as MarketplacePayload;
        const { collectionAddress } = _payload.collectionCreated;

        return () => navigate(generatePath(ROUTE.COLLECTION, { id: collectionAddress }));
      }

      default:
        return () => {};
    }
  };

  return (..._args: Parameters<typeof sendMessage>) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('Account is not found');

    const [address, metadata] = args;
    let unsub: UnsubscribePromise | undefined = undefined;

    const handleUserMessageSent = ({ data }: UserMessageSent) => {
      if (!metadata) throw new Error('Metadata is not found');

      const typeIndex = metadata.types.handle.output;
      if (typeIndex === null) throw new Error('handle.output type index is not found');

      const { message } = data;
      // TODO: error if details.isSome && !details.unwrap().isSuccess
      const { source, destination, payload } = message;

      if (source.toHex() !== address || destination.toHex() !== account.decodedAddress) return;

      const decodedPayload = metadata.createType(typeIndex, payload).toJSON();

      const isPayloadObject =
        typeof decodedPayload === 'object' && !Array.isArray(decodedPayload) && decodedPayload !== null;

      if (!isPayloadObject) return;

      const isSuccessPayload = Object.prototype.hasOwnProperty.call(decodedPayload, 'ok');
      const isErrorPayload = Object.prototype.hasOwnProperty.call(decodedPayload, 'err');

      if (isSuccessPayload) {
        const _payload = decodedPayload.ok as unknown as MarketplacePayload | CollectionPayload;

        const [key] = Object.keys(_payload) as (keyof MarketplacePayload | keyof CollectionPayload)[];
        const alertMessage = SUCCESS_MESSAGE[key];

        const onSuccess = getOnSuccess(_payload);

        onSuccess();
        alert.success(alertMessage);
      }

      if (isErrorPayload) alert.error(decodedPayload.err?.toString());

      unsub?.then((unsubCallback) => unsubCallback()).catch((error: Error) => alert.error(error.message));
    };

    unsub = api.gearEvents.subscribeToGearEvent('UserMessageSent', handleUserMessageSent);

    // TODO: unsub onError
    sendMessage(..._args);
  };
};

function useMarketplaceMessage() {
  const { marketplaceMetadata } = useMetadata();

  return useSendMessageWithReply(ADDRESS.CONTRACT, marketplaceMetadata, { disableAlerts: true });
}

function useCollectionMessage(id: string, typeId: string) {
  const { collectionsMetadata } = useMetadata();

  return useSendMessageWithReply(id as HexString, collectionsMetadata?.[typeId], { disableAlerts: true });
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
