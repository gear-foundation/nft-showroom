import { Input, InputProps } from '@gear-js/vara-ui';

import SearchSVG from './search.svg?react';

type Props = Omit<InputProps, 'SVG' | 'size'>;

function SearchInput(props: Props) {
  return <Input icon={SearchSVG} size="small" {...props} />;
}

export { SearchInput };
