import {
  ApiProvider as GearApiProvider,
  AccountProvider,
  AlertProvider as GearAlertProvider,
  ProviderProps,
} from '@gear-js/react-hooks';
import { Alert, alertStyles } from '@gear-js/vara-ui';
import { createClient } from 'graphql-ws';
import { ComponentType } from 'react';
import { Client, Provider as UrqlProvider, cacheExchange, fetchExchange, subscriptionExchange } from 'urql';

import { ADDRESS } from './consts';
import { MetadataProvider } from './context';

function ApiProvider({ children }: ProviderProps) {
  return <GearApiProvider initialArgs={{ endpoint: ADDRESS.NODE }}>{children}</GearApiProvider>;
}

const wsClient = createClient({ url: ADDRESS.INDEXER_WS });

const client = new Client({
  url: ADDRESS.INDEXER,
  exchanges: [
    cacheExchange,
    fetchExchange,

    subscriptionExchange({
      forwardSubscription(request) {
        const input = { ...request, query: request.query || '' };

        return {
          subscribe(sink) {
            const unsubscribe = wsClient.subscribe(input, sink);
            return { unsubscribe };
          },
        };
      },
    }),
  ],
});

function IndexerProvider({ children }: ProviderProps) {
  return <UrqlProvider value={client}>{children}</UrqlProvider>;
}

function AlertProvider({ children }: ProviderProps) {
  return (
    <GearAlertProvider template={Alert} containerClassName={alertStyles.root}>
      {children}
    </GearAlertProvider>
  );
}

const providers = [ApiProvider, AccountProvider, AlertProvider, IndexerProvider, MetadataProvider];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);

export { withProviders };
