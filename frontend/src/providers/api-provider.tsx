import { ApiProvider as GearApiProvider, ProviderProps } from '@gear-js/react-hooks';
import { ADDRESS } from '@/consts';

function ApiProvider({ children }: ProviderProps) {
  return <GearApiProvider initialArgs={{ endpoint: ADDRESS.NODE }}>{children}</GearApiProvider>;
}

export { ApiProvider };


