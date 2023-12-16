import {
  ApiProvider as GearApiProvider,
  AccountProvider,
  AlertProvider as GearAlertProvider,
  ProviderProps,
} from '@gear-js/react-hooks';
import { Alert, alertStyles } from '@gear-js/vara-ui';
import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { IPFSProvider as GearIPFSProvider } from './context';
import { ADDRESS } from './consts';

function ApiProvider({ children }: ProviderProps) {
  return <GearApiProvider initialArgs={{ endpoint: ADDRESS.NODE }}>{children}</GearApiProvider>;
}

function IPFSProvider({ children }: ProviderProps) {
  return <GearIPFSProvider url={ADDRESS.IPFS}>{children}</GearIPFSProvider>;
}

function AlertProvider({ children }: ProviderProps) {
  return (
    <GearAlertProvider template={Alert} containerClassName={alertStyles.root}>
      {children}
    </GearAlertProvider>
  );
}

const providers = [BrowserRouter, ApiProvider, IPFSProvider, AccountProvider, AlertProvider];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);

export { withProviders };
