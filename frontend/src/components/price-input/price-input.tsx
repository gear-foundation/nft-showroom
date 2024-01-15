import { Input, InputProps } from '@gear-js/vara-ui';
import { ForwardedRef, forwardRef } from 'react';

import VaraSVG from '@/assets/vara.svg?react';

function Component(props: Omit<InputProps, 'type' | 'icon'>, ref: ForwardedRef<HTMLInputElement>) {
  return <Input type="number" icon={VaraSVG} {...props} ref={ref} />;
}

const PriceInput = forwardRef(Component);

export { PriceInput };
