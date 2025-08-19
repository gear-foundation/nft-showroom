import { Checkbox as VaraCheckbox, CheckboxProps } from '@gear-js/vara-ui';
import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import { Props } from '../types';

const Checkbox = React.forwardRef<HTMLInputElement, Props<CheckboxProps>>(({ name, ...props }, ref) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <VaraCheckbox
          {...props}
          {...field}
          ref={ref}
        />
      )}
    />
  );
});
Checkbox.displayName = 'Checkbox';

export { Checkbox };
