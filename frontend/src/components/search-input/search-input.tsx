import { Input, InputProps } from '@gear-js/vara-ui';
import { ForwardedRef, forwardRef } from 'react';

import SearchSVG from './search.svg?react';

type Props = Omit<InputProps, 'SVG' | 'size'>;

function Component(props: Props, ref: ForwardedRef<HTMLInputElement>) {
  return <Input icon={SearchSVG} size="small" ref={ref} {...props} />;
}

const SearchInput = forwardRef(Component);

export { SearchInput };
