import { ProgramMetadata } from '@gear-js/api';
import { ProviderProps, useAlert } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { createContext, useContext, useEffect, useState } from 'react';

import { ADDRESS } from '@/consts';
import { getIpfsLink } from '@/utils';

import { DEFAULT_VALUE, MARKETPLACE_QUERY } from './consts';
import { MetadataRecord, Value } from './types';

const MarketplaceContext = createContext<Value>(DEFAULT_VALUE);
const { Provider } = MarketplaceContext;
const useMarketplace = () => useContext(MarketplaceContext);

function MarketplaceProvider({ children }: ProviderProps) {
  const alert = useAlert();

  const { data } = useQuery({ queryKey: ['marketplace'], queryFn: () => request(ADDRESS.INDEXER, MARKETPLACE_QUERY) });
  const marketplace = data?.marketplaceById;

  const [marketplaceMetadata, setMarketplaceMetadata] = useState<ProgramMetadata>();
  const [collectionsMetadata, setCollectionsMetadata] = useState<MetadataRecord>();

  const logPublicEnvs = () => console.log('public envs: ', { ...ADDRESS, CONTRACT: marketplace?.address });

  useEffect(() => {
    if (!marketplace) return;
    logPublicEnvs();

    const { metadata, collectionTypes } = marketplace;
    const collectionURLs = collectionTypes.map(({ metaUrl }) => fetch(getIpfsLink(metaUrl)));

    const getMetadata = (value: string) => ProgramMetadata.from(`0x${value}`);

    // TODO: performance
    // upload each .txt in a one folder to retrieve them in a single request?
    Promise.all(collectionURLs)
      .then((responses) => responses.map((response) => response.text()))
      .then((textPromises) => Promise.all(textPromises))
      .then((texts) => {
        const entries = texts.map((text, index) => [collectionTypes[index].type, getMetadata(text)] as const);

        setMarketplaceMetadata(getMetadata(metadata));
        setCollectionsMetadata(Object.fromEntries(entries));
      })
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketplace]);

  return <Provider value={{ marketplace, marketplaceMetadata, collectionsMetadata }}>{children}</Provider>;
}

export { MarketplaceProvider, useMarketplace };
