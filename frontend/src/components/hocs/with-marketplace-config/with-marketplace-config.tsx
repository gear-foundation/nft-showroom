import React, { FunctionComponent } from 'react';

import { useMarketplace } from '@/context';

// alongside with withApi, probably would be better to check loading inside of components where hook is used
// and render loading status directly there
function withMarketplaceConfig<P extends Record<string, unknown>>(Component: FunctionComponent<P>): React.FC<P> {
  return function WithApi(props: P) {
    const { marketplace } = useMarketplace();

    return marketplace ? <Component {...props} /> : null;
  };
}

export { withMarketplaceConfig };
