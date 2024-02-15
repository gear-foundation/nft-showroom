import VaraSVG from '@/assets/vara.svg?react';

import { Input, InputProps } from '../form';

function PriceInput(props: Omit<InputProps, 'type' | 'icon'>) {
  return <Input type="number" step="any" icon={VaraSVG} {...props} />;
}

export { PriceInput };
