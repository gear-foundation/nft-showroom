import { Select as VaraSelect, SelectProps } from '@gear-js/vara-ui';
import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import { Props } from '../types';

const Select = React.forwardRef<HTMLSelectElement, Props<SelectProps>>(({ name, ...props }, ref) => {
  const { control, formState } = useFormContext();
  const { errors } = formState;

  const error = errors[name]?.message?.toString();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <VaraSelect {...props} {...field} ref={ref} error={error} />}
    />
  );
});
Select.displayName = 'Select';

export { Select };
