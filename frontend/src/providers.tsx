import { ComponentType } from 'react';

import { MarketplaceProvider } from './context';
import { AccountProvider } from './providers/account-provider';
import { AlertProvider } from './providers/alert-provider';
import { ApiProvider } from './providers/api-provider';
import { IndexerProvider } from './providers/indexer-provider';

const providers = [ApiProvider, AccountProvider, AlertProvider, IndexerProvider, MarketplaceProvider];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);

export { withProviders };
