import { useReadFullState, useSendMessageHandler } from '@gear-js/react-hooks';

import metadataSource from '@/assets/nft_marketplace.meta.txt';
import { ADDRESS } from '@/consts';

import { useProgramMetadata } from '../use-program-metadata';

function useMarketplaceMetadata() {
  return useProgramMetadata(metadataSource);
}

function useSendMarketplaceMessage() {
  const metadata = useMarketplaceMetadata();

  return useSendMessageHandler(ADDRESS.CONTRACT, metadata);
}

function useMarketplaceState<T>(payload: string) {
  const metadata = useMarketplaceMetadata();

  return useReadFullState<T>(ADDRESS.CONTRACT, metadata, payload);
}

export { useMarketplaceMetadata, useSendMarketplaceMessage, useMarketplaceState };
