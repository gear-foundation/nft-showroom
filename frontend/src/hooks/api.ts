import { HexString, UserMessageSent } from '@gear-js/api';
import { useAccount, useAlert, useApi, useSendMessageHandler } from '@gear-js/react-hooks';
import { UnsubscribePromise } from '@polkadot/api/types';
import { AnyJson } from '@polkadot/types/types';

import { ADDRESS } from '@/consts';
import { useMetadata } from '@/context';
import { ApproveNFTPayload, MintNFTPayload, TransferNFTPayload } from '@/features/collections';
import { CreateCollectionPayload, CreateCollectionReply } from '@/features/create-simple-collection';
import { BuyNFTPayload, MakeBidPayload, StartAuctionPayload, StartSalePayload } from '@/features/marketplace';
import { isObject } from '@/utils';

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

    const [programId, metadata] = args;
    let unsub: UnsubscribePromise | undefined = undefined;

    const _onFinally = () => {
      onFinally();

      // for dev purposes only, since unsub is tricky
      if (!unsub) throw new Error('Failed to unsubscribe from reply');

      unsub.then((unsubCallback) => unsubCallback()).catch((error: Error) => alert.error(error.message));
    };

    const handleUserMessageSent = ({ data }: UserMessageSent) => {
      try {
        if (!metadata) throw new Error('Failed to get transaction result: metadata is not found');

        const typeIndex = metadata.types.handle.output;
        if (typeIndex === null)
          throw new Error('Failed to get transaction result: handle.output type index is not found');

        const { message } = data;
        const { source, destination, payload, details } = message;

        if (source.toHex() !== programId || destination.toHex() !== account.decodedAddress) return;

        const isSuccess = details.isSome ? details.unwrap().code.isSuccess : true;
        if (!isSuccess) throw new Error(payload.toHuman()?.toString());

        const decodedPayload = metadata.createType(typeIndex, payload).toJSON();

        if (!isObject(decodedPayload)) throw new Error('Failed to get transaction result: payload is not an object');

        const isErrorPayload = Object.prototype.hasOwnProperty.call(decodedPayload, 'err');
        if (isErrorPayload) throw new Error(decodedPayload.err?.toString());

        const isSuccessPayload = Object.prototype.hasOwnProperty.call(decodedPayload, 'ok');
        if (!isSuccessPayload) throw new Error('Failed to get transaction result: ok property is not found');

        onSuccess(decodedPayload.ok as Reply<T>);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        alert.error(errorMessage);
      }

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

  return <T extends StartAuctionPayload | StartSalePayload>(args: {
    payload: T;
    onSuccess: () => void;
    onFinally: () => void;
  }) => {
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
