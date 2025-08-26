import { Textarea as VaraTextarea, TextareaProps } from '@gear-js/vara-ui';
import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import { Props } from '../types';

const Textarea = React.forwardRef<HTMLTextAreaElement, Props<TextareaProps>>(({ name, ...props }, ref) => {
  const { control, formState } = useFormContext();
  const { errors } = formState;

  const error = errors[name]?.message?.toString();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <VaraTextarea {...props} {...field} error={error} ref={ref} />}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
