import { HexString } from '@gear-js/api';
import { ProviderProps, useApi, useSendMessageHandler } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { ComponentType, createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { ADDRESS } from '@/consts';
import { useMarketplaceSendMessage } from '@/features/marketplace';
import { useProgramMetadata } from '@/hooks';
import { withProviders } from '@/providers';
import { getIpfsLink } from '@/utils';

import { useNFT } from './hooks';

type Params = {
  collectionId: HexString;
  id: string;
};

type Value = ReturnType<typeof useNFT> & {
  sendMessage: (args: {
    payload: Record<string, Record<'tokenId', string> | Record<string, AnyJson>>;
    onSuccess: () => void;
  }) => void;
};

const NFTContext = createContext<Value | undefined>(undefined);
const { Provider } = NFTContext;
const useNFTContext = () => useContext(NFTContext);

function NFTProvider({ children }: ProviderProps) {
  const { collectionId, id } = useParams() as Params;
  const nft = useNFT(collectionId, id);

  const { collection } = nft || {};
  const metadata = useProgramMetadata(collection ? getIpfsLink(collection.type.metaUrl) : '');
  const sendCollectionMessage = useSendMessageHandler(collection?.id as HexString, metadata);

  const sendMarketplaceMessage = useMarketplaceSendMessage();

  const sendMessage = (args: {
    payload: Record<string, Record<'tokenId', string> | Record<string, AnyJson>>;
    onSuccess: () => void;
  }) => {
    const to = ADDRESS.CONTRACT;
    const [{ tokenId }] = Object.values(args.payload);

    const payload = { Approve: { to, tokenId } };
    const onSuccess = () => sendMarketplaceMessage(args);

    sendCollectionMessage({ payload, onSuccess });
  };

  const { api } = useApi();

  const value = useMemo(() => (nft ? { ...nft, sendMessage } : undefined), [nft, metadata, api]);

  return <Provider value={value}>{children}</Provider>;
}

const withNFTProvider = (Component: ComponentType) => withProviders(Component, [NFTProvider]);

export { withNFTProvider, useNFTContext };
