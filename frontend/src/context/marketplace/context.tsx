import { ProviderProps } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { createContext, useEffect } from 'react';

import { ADDRESS } from '@/consts';

import { DEFAULT_VALUE, MARKETPLACE_QUERY } from './consts';
import { Value } from './types';

const MarketplaceContext = createContext<Value>(DEFAULT_VALUE);
const { Provider } = MarketplaceContext;

function MarketplaceProvider({ children }: ProviderProps) {
  const { data } = useQuery({ queryKey: ['marketplace'], queryFn: () => request(ADDRESS.INDEXER, MARKETPLACE_QUERY) });
  const marketplace = data?.marketplaceById;

  const logPublicEnvs = () => console.log('public envs: ', { ...ADDRESS, CONTRACT: marketplace?.address });

  useEffect(() => {
    if (!marketplace) return;
    logPublicEnvs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketplace]);

  return <Provider value={{ marketplace }}>{children}</Provider>;
}

export { MarketplaceProvider, MarketplaceContext };
