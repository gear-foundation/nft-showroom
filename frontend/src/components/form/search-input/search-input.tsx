import { Input as VaraInput } from '@gear-js/vara-ui';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { InputProps } from '../types';

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(({ name, ...props }, ref) => {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  const error = errors[name]?.message?.toString();

  return <VaraInput {...props} {...register(name)} error={error} ref={ref} />;
});
SearchInput.displayName = 'SearchInput';

export { SearchInput };
