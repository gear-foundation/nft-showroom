import { useSearchParams } from 'react-router-dom';

import { FIELD_NAME } from './consts';

function useNFTSearchParam() {
  const [params] = useSearchParams();
  const value = params.get(FIELD_NAME.QUERY) || '';

  const set = (query: string) => {
    params.set(FIELD_NAME.QUERY, query);
    return params.toString();
  };

  const reset = () => {
    params.delete(FIELD_NAME.QUERY);
    return '';
  };

  return { value, set, reset };
}

export { useNFTSearchParam };
