import { zodResolver } from '@hookform/resolvers/zod';
import { Children, ReactNode, createElement, isValidElement } from 'react';
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm } from 'react-hook-form';
import { ZodType } from 'zod';

type UseFormProps<T extends FieldValues> = {
  defaultValues: DefaultValues<T>;
  schema?: ZodType;
};

type FormProps<T extends FieldValues> = {
  children: ReactNode;
  className?: string;
  onSubmit: SubmitHandler<T>;
};

type Props<T extends FieldValues> = FormProps<T> & UseFormProps<T>;

function Form<T extends FieldValues>({ children, onSubmit, schema, defaultValues, ...props }: Props<T>) {
  const resolver = schema ? zodResolver(schema) : undefined;
  const { register, handleSubmit, formState } = useForm<T>({ defaultValues, resolver });

  const renderChildren = () =>
    Children.map(children, (child) => {
      if (!isValidElement<HTMLElement | HTMLInputElement>(child)) return child;

      const { type, props: _props } = child;
      const name = 'name' in _props ? (_props.name as Path<T>) : '';

      if (!name) return child;

      const { errors } = formState;
      const error = errors[name]?.message;

      return createElement(type, { ..._props, ...register(name), error });
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      {renderChildren()}
    </form>
  );
}

export { Form };
