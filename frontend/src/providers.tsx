import {
  ApiProvider as GearApiProvider,
  AccountProvider,
  AlertProvider as GearAlertProvider,
  ProviderProps,
} from '@gear-js/react-hooks';
import { Alert, alertStyles } from '@gear-js/vara-ui';
import { ComponentType, useRef } from 'react';
import { Client, Provider as UrqlProvider, cacheExchange, fetchExchange } from 'urql';

import { ADDRESS } from './consts';
import { IPFSProvider as GearIPFSProvider, MetadataProvider } from './context';

function ApiProvider({ children }: ProviderProps) {
  return <GearApiProvider initialArgs={{ endpoint: ADDRESS.NODE }}>{children}</GearApiProvider>;
}

function IPFSProvider({ children }: ProviderProps) {
  return <GearIPFSProvider url={ADDRESS.IPFS}>{children}</GearIPFSProvider>;
}

function IndexerProvider({ children }: ProviderProps) {
  const ref = useRef(new Client({ url: ADDRESS.INDEXER, exchanges: [cacheExchange, fetchExchange] }));

  return <UrqlProvider value={ref.current}>{children}</UrqlProvider>;
}

function AlertProvider({ children }: ProviderProps) {
  return (
    <GearAlertProvider template={Alert} containerClassName={alertStyles.root}>
      {children}
    </GearAlertProvider>
  );
}

const providers = [ApiProvider, IPFSProvider, AccountProvider, AlertProvider, IndexerProvider, MetadataProvider];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);

export { withProviders };
