import { useApi } from '@gear-js/react-hooks';
import { FunctionComponent } from 'react';

function withApi<T>(Component: FunctionComponent<T>) {
  return function WithApi(props: T & JSX.IntrinsicAttributes) {
    const { isApiReady } = useApi();

    return isApiReady ? <Component {...props} /> : null;
  };
}

export { withApi };
