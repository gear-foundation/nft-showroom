import { Input, InputProps } from '@gear-js/vara-ui';

import VaraSVG from '@/assets/vara.svg?react';

function PriceInput(props: Omit<InputProps, 'type' | 'icon'>) {
  return <Input type="number" icon={VaraSVG} {...props} />;
}

export { PriceInput };
