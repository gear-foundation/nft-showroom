import { ProgramMetadata } from '@gear-js/api';
import { ProviderProps, useAlert } from '@gear-js/react-hooks';
import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'urql';

import { graphql } from '@/graphql';
import { getIpfsLink } from '@/utils';

type MetadataRecord = Record<string, ProgramMetadata>;

type Value = {
  marketplaceMetadata: ProgramMetadata | undefined;
  collectionsMetadata: MetadataRecord | undefined;
};

const DEFAULT_VALUE = {
  marketplaceMetadata: undefined,
  collectionsMetadata: undefined,
};

const MetadataContext = createContext<Value>(DEFAULT_VALUE);
const { Provider } = MetadataContext;
const useMetadata = () => useContext(MetadataContext);

const MARKETPLACE_QUERY = graphql(`
  query MarketplaceQuery {
    marketplaceById(id: "1") {
      address
      metadata
      collectionTypes {
        description
        id
        metaUrl
        type
      }
    }
  }
`);

function useMarketplace() {
  const [result] = useQuery({ query: MARKETPLACE_QUERY });

  return result.data?.marketplaceById;
}

function MetadataProvider({ children }: ProviderProps) {
  const alert = useAlert();

  const marketplace = useMarketplace();

  const [marketplaceMetadata, setMarketplaceMetadata] = useState<ProgramMetadata>();
  const [collectionsMetadata, setCollectionsMetadata] = useState<MetadataRecord>();

  useEffect(() => {
    if (!marketplace) return;

    const { metadata, collectionTypes } = marketplace;
    const collectionURLs = collectionTypes.map(({ metaUrl }) => fetch(getIpfsLink(metaUrl)));
    const requests = [...collectionURLs];

    const getMetadata = (value: string) => ProgramMetadata.from(`0x${value}`);

    // TODO: performance
    // upload each .txt in a one folder to retrive them in a single request
    Promise.all(requests)
      .then((responses) => responses.map((response) => response.text()))
      .then((textPromises) => Promise.all(textPromises))
      .then((texts) => {
        const entries = texts.map((text, index) => [collectionTypes[index].id, getMetadata(text)] as const);

        setMarketplaceMetadata(getMetadata(metadata));
        setCollectionsMetadata(Object.fromEntries(entries));
      })
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketplace]);

  return <Provider value={{ marketplaceMetadata, collectionsMetadata }}>{children}</Provider>;
}

export { MetadataProvider, useMetadata };
