import { ProgramMetadata } from '@gear-js/api';
import { ProviderProps, useAlert } from '@gear-js/react-hooks';
import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'urql';

import marketplaceMetadataSource from '@/assets/nft_marketplace.meta.txt';
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

const COLLECTION_TYPES_QUERY = graphql(`
  query CollectionTypesQuery {
    collectionTypes {
      description
      id
      metaUrl
      type
    }
  }
`);

function useCollectionTypes() {
  const [result] = useQuery({ query: COLLECTION_TYPES_QUERY });

  return result.data?.collectionTypes;
}

function MetadataProvider({ children }: ProviderProps) {
  const alert = useAlert();

  const [metadata, setMetadata] = useState<MetadataRecord>();
  const { marketplaceMetadata, ...collectionsMetadata } = metadata || {};

  const collectionTypes = useCollectionTypes();

  useEffect(() => {
    if (!collectionTypes) return;

    const collectionURLs = collectionTypes
      .filter(({ type }) => type !== 'nft') // TODOINDEXER: remove after db cleanup
      .map(({ metaUrl }) => fetch(getIpfsLink(metaUrl)));

    const requests = [fetch(marketplaceMetadataSource), ...collectionURLs];

    // TODO: performance
    // upload each .txt in a one folder to retrive them in a single request
    Promise.all(requests)
      .then((responses) => responses.map((response) => response.text()))
      .then((textPromises) => Promise.all(textPromises))
      .then((texts) => {
        const entries = texts.map(
          (text, index) =>
            [
              index === 0 ? 'marketplaceMetadata' : collectionTypes[index].id,
              ProgramMetadata.from(`0x${text}`),
            ] as const,
        );

        setMetadata(Object.fromEntries(entries));
      })
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionTypes]);

  return <Provider value={{ marketplaceMetadata, collectionsMetadata }}>{children}</Provider>;
}

export { MetadataProvider, useMetadata };
