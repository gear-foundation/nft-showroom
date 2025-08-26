import { useApi } from '@gear-js/react-hooks';
import React, { FunctionComponent } from 'react';

function withApi<P extends Record<string, unknown>>(Component: FunctionComponent<P>): React.FC<P> {
  return function WithApi(props: P) {
    const { isApiReady } = useApi();

    return isApiReady ? <Component {...props} /> : null;
  };
}

export { withApi };
