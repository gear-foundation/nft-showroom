import { Input as VaraInput } from '@gear-js/vara-ui';
import { useFormContext } from 'react-hook-form';

import { InputProps } from '../types';

function Input({ name, ...props }: InputProps) {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  const errorMessage = errors[name]?.message;
  const error = typeof errorMessage === 'string' ? errorMessage : undefined;

  return <VaraInput {...props} {...register(name)} error={error} />;
}

export { Input };
