import { useAccount } from '@gear-js/react-hooks';
import React, { FunctionComponent } from 'react';

function withAccount<P extends Record<string, unknown>>(Component: FunctionComponent<P>): React.FC<P> {
  return function WithAccount(props: P) {
    const { account, isAccountReady } = useAccount();

    return isAccountReady && account ? <Component {...props} /> : null;
  };
}

export { withAccount };
