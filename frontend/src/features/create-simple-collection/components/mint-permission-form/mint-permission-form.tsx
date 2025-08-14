import { Button, Radio } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, Controller, FormProvider } from 'react-hook-form';
import { z } from 'zod';

import { Identicon, Input, TruncatedText } from '@/components';
import { SCHEMA } from '@/consts';
import { useChangeEffect } from '@/hooks';
import { cx } from '@/utils';

import { Tag } from '../tag';

import styles from './mint-permission-form.module.scss';

type Values = {
  value: 'any' | 'admin' | 'custom';
  address: string;
  addresses: { value: string }[];
};

const schema = z
  .object({
    value: z.enum(['any', 'admin', 'custom']),
    address: SCHEMA.ADDRESS,
    addresses: z.array(z.object({ value: z.string() })),
  })
  .refine(({ address, addresses }) => !addresses.find(({ value }) => value === address), {
    message: 'Address already exists',
    path: ['address'],
  });

const resolver = zodResolver(schema);

type Props = {
  defaultValues: {
    value: 'any' | 'admin' | 'custom';
    addresses: { value: string }[];
  };
  onChange: (value: { value: 'any' | 'admin' | 'custom'; addresses: { value: string }[] }) => void;
  error: string | undefined;
};

function MintPermissionForm({ defaultValues, error, onChange }: Props) {
  const methods = useForm<Values>({
    defaultValues: { ...defaultValues, address: '' },
    resolver,
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    resetField,
    clearErrors,
    setValue,
    watch,
  } = methods;
  const { value: selectedValue } = watch();

  const { fields, append, remove } = useFieldArray({ control, name: 'addresses' });

  useChangeEffect(() => {
    resetField('address');

    // resetField doesn't work for useFieldArray with no registered fields
    // see: https://github.com/orgs/react-hook-form/discussions/8299
    setValue('addresses', []);
  }, [selectedValue]);

  useChangeEffect(() => {
    onChange({ value: selectedValue, addresses: fields });
  }, [selectedValue, fields]);

  const onSubmit = (values: Values) => {
    append({ value: values.address });
    resetField('address');
  };

  const renderAddresses = () =>
    fields.map(({ value }, index) => {
      const handleRemoveClick = () => {
        remove(index);
        clearErrors();
      };

      return (
        <Tag key={value} onRemoveClick={handleRemoveClick}>
          <Identicon value={value} size={16} />
          <TruncatedText value={value} />
        </Tag>
      );
    });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* TODO: fieldset from @gear-js/vara-ui */}
        <fieldset className={cx(styles.fieldset, error && styles.error)}>
          <legend className={styles.legend}>Who can mint</legend>
          <div className={styles.radios}>
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <>
                  <Radio
                    label="Everyone"
                    value="any"
                    checked={field.value === 'any'}
                    onChange={() => field.onChange('any')}
                  />
                  <Radio
                    label="Admin only"
                    value="admin"
                    checked={field.value === 'admin'}
                    onChange={() => field.onChange('admin')}
                  />
                  <Radio
                    label="Specify"
                    value="custom"
                    checked={field.value === 'custom'}
                    onChange={() => field.onChange('custom')}
                  />
                </>
              )}
            />
          </div>

          {selectedValue === 'custom' && (
            <div className={styles.addAddress}>
              <Input label="Address" size="small" name={'address'} error={errors?.address?.message} block />
              <Button text="Add" size="small" color="border" type="submit" className={styles.addButton} />
            </div>
          )}
          {Boolean(fields.length) && <ul className={styles.addresses}>{renderAddresses()}</ul>}
        </fieldset>

        <p className={styles.errorMessage}>{error}</p>
      </form>
    </FormProvider>
  );
}

export { MintPermissionForm };
