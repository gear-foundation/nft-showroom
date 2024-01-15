import { HexString } from '@gear-js/api';
import { useReadFullState, useSendMessageHandler } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';

import metadataSource from '@/assets/nft_marketplace.meta.txt';
import { ADDRESS } from '@/consts';
import { CollectionState, CollectionsState, MarketplaceState } from '@/features/collections/types';
import { getIpfsLink } from '@/utils';

import { useProgramMetadata } from '../use-program-metadata';

function useMarketplaceMetadata() {
  return useProgramMetadata(metadataSource);
}

function useMarketplaceSendMessage() {
  const metadata = useMarketplaceMetadata();

  return useSendMessageHandler(ADDRESS.CONTRACT, metadata);
}

function useMarketplaceState<T>(payload: string) {
  const metadata = useMarketplaceMetadata();

  return useReadFullState<T>(ADDRESS.CONTRACT, metadata, payload);
}

function useCollectionMetadata(collectionId: HexString) {
  const { state } = useMarketplaceState<MarketplaceState>('All');

  const collections = state?.All.collectionToOwner;
  const types = state?.All.typeCollections;

  const collection = collections?.find(([id]) => id === collectionId);
  const typeName = collection?.[1][0];

  const type = types?.find(([name]) => name === typeName);
  const source = type ? getIpfsLink(type[1].metaLink) : '';

  return useProgramMetadata(source);
}

function useCollection(collectionId: HexString) {
  const metadata = useCollectionMetadata(collectionId);
  const { state } = useReadFullState<CollectionState>(collectionId, metadata, 'All');

  return state?.All;
}

function useCollectionSendMessage(collectionId: HexString) {
  const metadata = useCollectionMetadata(collectionId);

  return useSendMessageHandler(collectionId, metadata);
}

function useNFTSendMessage(collectionId: HexString) {
  const sendMarketplaceMessage = useMarketplaceSendMessage();
  const sendCollectionMessage = useCollectionSendMessage(collectionId);

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

function useCollectionIds() {
  const { state } = useMarketplaceState<CollectionsState>('AllCollections');

  return state?.AllCollections;
}

function useListing(collectionId: HexString, nftId: string) {
  const { state } = useMarketplaceState<MarketplaceState>('all');

  const sale = state?.All.sales.find(
    ([[_collectionId, _nftId]]) => _collectionId === collectionId && _nftId === nftId,
  )?.[1];

  const auction = state?.All.auctions.find(
    ([[_collectionId, _nftId]]) => _collectionId === collectionId && _nftId === nftId,
  )?.[1];

  return { sale, auction };
}

export {
  useMarketplaceMetadata,
  useMarketplaceSendMessage,
  useCollection,
  useCollectionSendMessage,
  useNFTSendMessage,
  useCollectionIds,
  useListing,
};
