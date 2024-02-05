import { HexString } from '@gear-js/api';
import { useSendMessageHandler, useReadFullState } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useMemo } from 'react';

import { ADDRESS } from '@/consts';
import { useCollectionSendMessage } from '@/features/collections';
import { useProgramMetadata } from '@/hooks';
import { getIpfsLink } from '@/utils';

import metadataSource from '../assets/nft_marketplace.meta.txt';
import { CollectionState, MarketplaceState } from '../types';

function useMarketplaceMetadata() {
  return useProgramMetadata(metadataSource);
}

function useMarketplaceSendMessage() {
  const metadata = useMarketplaceMetadata();

  return useSendMessageHandler(ADDRESS.CONTRACT, metadata);
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

function useMarketplaceState<T>(payload: AnyJson) {
  const metadata = useMarketplaceMetadata();

  return useReadFullState<T>(ADDRESS.CONTRACT, metadata, payload);
}

function useCollectionMetadata(collectionId: HexString) {
  const payload = useMemo(() => ({ GetCollectionInfo: collectionId }), [collectionId]);
  const { state } = useMarketplaceState<CollectionState>(payload);

  const collection = state?.CollectionInfo;
  const source = collection ? getIpfsLink(collection.metaLink) : '';

  return useProgramMetadata(source);
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
  useMarketplaceMetadata, // TODO: could be temporary export, check after migration to indexer
  useMarketplaceSendMessage,
  useNFTSendMessage,
  useCollectionMetadata,
  useListing,
};
