import { zodResolver } from '@hookform/resolvers/zod';
import {
  FieldValues,
  UseFormProps,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormReturn,
  useForm as useHookForm,
} from 'react-hook-form';
import { z } from 'zod';

function useForm<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TSchema extends z.Schema<any, any>,
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
>(
  props: Omit<UseFormProps<TFieldValues, TContext>, 'resolver'> & { schema?: TSchema },
): Omit<UseFormReturn<TFieldValues, TContext, TTransformedValues>, 'register'> & {
  register: (
    ...param: Parameters<UseFormRegister<TFieldValues>>
  ) => UseFormRegisterReturn<Parameters<UseFormRegister<TFieldValues>>[0]> & { error: string | undefined };
} {
  const { schema } = props;
  const resolver = schema ? zodResolver(schema) : undefined;
  const args: UseFormProps<TFieldValues, TContext> = { ...props, resolver };

  const form = useHookForm(args);

  const register = (
    ..._args: Parameters<UseFormRegister<TFieldValues>>
  ): UseFormRegisterReturn<typeof name> & { error: string | undefined } => {
    const { formState } = form;
    const { errors } = formState;

    const [name] = _args;
    const error = errors[name]?.message as string;

    const values: UseFormRegisterReturn<typeof name> = form.register(..._args);

    return { ...values, error };
  };

  return { ...form, register };
}

export { useForm };
