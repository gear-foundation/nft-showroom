import { Radio as VaraRadio, RadioProps } from '@gear-js/vara-ui';
import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import { Props } from '../types';

const Radio = React.forwardRef<HTMLInputElement, Props<RadioProps>>(({ name, ...props }, ref) => {
  const { control } = useFormContext();

  return (
    <Controller name={name} control={control} render={({ field }) => <VaraRadio {...props} {...field} ref={ref} />} />
  );
});
Radio.displayName = 'Radio';

export { Radio };
