import { HexString } from '@gear-js/api';
import { ProviderProps, useSendMessageHandler } from '@gear-js/react-hooks';
import { createContext, useContext, ComponentType, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useProgramMetadata } from '@/hooks';
import { withProviders } from '@/providers';
import { getIpfsLink } from '@/utils';

import { useCollection } from '../hooks';

type Params = {
  id: HexString;
};

type Value = ReturnType<typeof useCollection> & {
  sendMessage: ReturnType<typeof useSendMessageHandler>;
};

const CollectionContext = createContext<Value | undefined>(undefined);
const { Provider } = CollectionContext;

const CollectionProvider = ({ children }: ProviderProps) => {
  const { id } = useParams() as Params;
  const collection = useCollection(id);

  const metadata = useProgramMetadata(collection ? getIpfsLink(collection.type.metaUrl) : '');
  const sendMessage = useSendMessageHandler(collection?.id as HexString, metadata);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => (collection ? { ...collection, sendMessage } : undefined), [collection, metadata]);

  return <Provider value={value}>{children}</Provider>;
};

const withCollectionProvider = (Component: ComponentType) => withProviders(Component, [CollectionProvider]);

const useCollectionContext = () => useContext(CollectionContext);

export { withCollectionProvider, useCollectionContext };
