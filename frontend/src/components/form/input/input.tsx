import { Input as VaraInput } from '@gear-js/vara-ui';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { InputProps } from '../types';

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ name, ...props }, ref) => {
  const { control, formState } = useFormContext();
  const { errors } = formState;

  const error = errors[name]?.message?.toString();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <VaraInput {...props} {...field} error={error} ref={ref} />}
    />
  );
});
Input.displayName = 'Input';

export { Input };
