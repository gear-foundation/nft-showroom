import VaraSVG from '@/assets/vara.svg?react';

import { SearchInput, InputProps } from '../../form';

function PriceInput(props: Omit<InputProps, 'type' | 'icon'>) {
  return <SearchInput type="number" step="any" icon={VaraSVG} {...props} />;
}

export { PriceInput };
