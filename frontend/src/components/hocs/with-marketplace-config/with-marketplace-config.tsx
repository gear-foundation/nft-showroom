import { FunctionComponent } from 'react';

import { useMarketplace } from '@/context';

// alongside with withApi, probably would be better to check loading inside of components where hook is used
// and render loading status directly there
function withMarketplaceConfig<T>(Component: FunctionComponent<T>) {
  return function WithApi(props: T & JSX.IntrinsicAttributes) {
    const { marketplace } = useMarketplace();

    return marketplace ? <Component {...props} /> : null;
  };
}

export { withMarketplaceConfig };
