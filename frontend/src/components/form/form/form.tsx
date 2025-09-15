import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useEffect } from 'react';
import { DefaultValues, FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { ZodType } from 'zod';

type Props<T extends FieldValues> = {
  defaultValues: DefaultValues<T>;
  schema: ZodType;
  children: ReactNode;
  className?: string;
  onSubmit: SubmitHandler<T>;
};

function Form<T extends FieldValues>({ defaultValues, schema, children, className, onSubmit }: Props<T>) {
  const resolver = schema ? zodResolver(schema) : undefined;

  const methods = useForm<T>({ defaultValues, resolver, mode: 'onChange' });
  const { handleSubmit } = methods;

  const values = methods.watch();

  useEffect(() => {
    console.log(values);
  }, [values]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
}

export { Form };
