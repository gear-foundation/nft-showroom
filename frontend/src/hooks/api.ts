import { HexString, UserMessageSent } from '@gear-js/api';
import { useAccount, useAlert, useApi, useSendMessageHandler } from '@gear-js/react-hooks';
import { UnsubscribePromise } from '@polkadot/api/types';
import { AnyJson } from '@polkadot/types/types';

import { ADDRESS } from '@/consts';
import { useMetadata } from '@/context';
import { ApproveNFTPayload, MintNFTPayload, TransferNFTPayload } from '@/features/collections';
import { CreateCollectionPayload, CreateCollectionReply } from '@/features/create-simple-collection';
import { BuyNFTPayload, MakeBidPayload, StartAuctionPayload, StartSalePayload } from '@/features/marketplace';

type Payload =
  | CreateCollectionPayload
  | BuyNFTPayload
  | MakeBidPayload
  | StartAuctionPayload
  | StartSalePayload
  | MintNFTPayload
  | TransferNFTPayload
  | ApproveNFTPayload;

type Reply<T> = T extends CreateCollectionPayload
  ? CreateCollectionReply
  : T extends BuyNFTPayload
  ? { nftSold: unknown }
  : T extends MakeBidPayload
  ? { bidAdded: unknown }
  : T extends StartAuctionPayload
  ? { auctionCreated: unknown }
  : T extends StartSalePayload
  ? { saleNft: unknown }
  : T extends MintNFTPayload
  ? { minted: unknown }
  : T extends TransferNFTPayload
  ? { transferred: unknown }
  : T extends ApproveNFTPayload
  ? { approved: unknown }
  : AnyJson;

const useSendMessageWithReply = (...args: Parameters<typeof useSendMessageHandler>) => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const alert = useAlert();

  const sendMessage = useSendMessageHandler(...args);

  // TODO: different payload types for marketplace and collection hooks
  return <T extends Payload>({
    onSuccess = () => {},
    onFinally = () => {},
    ...sendMessageArgs
  }: {
    payload: T;
    value?: string | number;
    onSuccess?: (value: Reply<T>) => void;
    onFinally?: () => void;
  }) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('Account is not found');

    const [address, metadata] = args;
    let unsub: UnsubscribePromise | undefined = undefined;

    const _onFinally = () => {
      onFinally();

      unsub
        ?.then((unsubCallback) => {
          console.log('unsubCallback: ', unsubCallback);
          unsubCallback();
        })
        .catch((error: Error) => alert.error(error.message));
    };

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
        onSuccess(decodedPayload.ok as Reply<T>);
      }

      if (isErrorPayload) alert.error(decodedPayload.err?.toString());

      _onFinally();
    };

    unsub = api.gearEvents.subscribeToGearEvent('UserMessageSent', handleUserMessageSent);

    sendMessage({ ...sendMessageArgs, onError: _onFinally });
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
  const alert = useAlert();

  const sendMarketplaceMessage = useMarketplaceMessage();
  const sendCollectionMessage = useCollectionMessage(collectionId, collectionTypeId);

  return <T extends StartAuctionPayload | StartSalePayload>(args: { payload: T; onSuccess: () => void }) => {
    const to = ADDRESS.CONTRACT;

    const [{ tokenId }] = Object.values(args.payload) as unknown as
      | StartAuctionPayload[keyof StartAuctionPayload][]
      | StartSalePayload[keyof StartSalePayload][];

    const payload = { Approve: { to, tokenId } };

    const onSuccess = () => {
      alert.success('NFT is approved to Marketplace contract');
      sendMarketplaceMessage(args);
    };

    sendCollectionMessage({ payload, onSuccess });
  };
}

export { useMarketplaceMessage, useCollectionMessage, useApprovedMessage };
