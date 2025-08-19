import { useApi, useBalanceFormat } from '@gear-js/react-hooks';
import { Button, Select, Checkbox } from '@gear-js/vara-ui';
import { useCallback, ChangeEvent } from 'react';
import { useFieldArray, Controller, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import VaraSVG from '@/assets/vara.svg?react';
import { Container, Form, Input } from '@/components';
import { useChangeEffect } from '@/hooks';

import PercentSVG from '../../assets/percent.svg?react';
import { ParametersValues } from '../../types';
import { MintPermissionForm } from '../mint-permission-form/mint-permission-form';
import { Tag } from '../tag';

import styles from './parameters-form.module.scss';

type Props = {
  defaultValues: ParametersValues;
  onSubmit: (values: ParametersValues) => void;
  onBack: () => void;
};

const PLACEHOLDER_TAG = { value: '', label: 'Select tag' };
const TAGS = ['Game', 'Metaverse', 'Hero'];

function ParametersFormContent() {
  const { control, setValue, clearErrors, watch, formState } = useFormContext<ParametersValues>();
  const { isSellable } = watch();
  const { errors } = formState;

  useChangeEffect(() => {
    setValue('royalty', '0');
    setValue('isTransferable', isSellable);
  }, [isSellable, setValue]);

  const { fields, append, remove } = useFieldArray({ control, name: 'tags' });

  const isTagSelected = useCallback((value: string) => fields.some((tag) => value === tag.value), [fields]);

  const options = TAGS.filter((value) => !isTagSelected(value)).map((value) => ({
    value,
    label: value,
  }));

  const handleTagChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    append({ value: target.value });
    target.value = ''; // reset to placeholder value, since selected options will be deleted
  };

  const renderTags = () =>
    fields.map(({ value }, index) => (
      <Tag key={value} onRemoveClick={() => remove(index)}>
        {value}
      </Tag>
    ));

  return (
    <>
      <Controller
        name="mintPermission"
        control={control}
        render={({ field }) => (
          <MintPermissionForm
            onChange={(value) => {
              field.onChange(value);
              clearErrors('mintPermission.value');
            }}
            defaultValues={field.value}
            error={errors.mintPermission?.value?.message}
          />
        )}
      />

      <Input type="number" step="any" label="Minting limit per user" name={'mintLimit'} />
      <Input type="number" step="any" icon={VaraSVG} label={'Minting price'} name={'mintPrice'} />

      <div>
        <Select
          label="Tags"
          options={[PLACEHOLDER_TAG, ...options]}
          disabled={!options.length}
          onChange={handleTagChange}
        />

        {Boolean(fields.length) && <ul className={styles.tags}>{renderTags()}</ul>}
      </div>

      <Controller
        name="isMetadataChangesAllowed"
        control={control}
        render={({ field }) => (
          <Checkbox label="Allow metadata changes" type="switch" checked={field.value} onChange={field.onChange} />
        )}
      />
      <Controller
        name="isTransferable"
        control={control}
        render={({ field }) => (
          <Checkbox
            label="Allow transferring"
            type="switch"
            checked={field.value}
            onChange={field.onChange}
            disabled={isSellable}
          />
        )}
      />
      <Controller
        name="isSellable"
        control={control}
        render={({ field }) => (
          <Checkbox label="Allow selling" type="switch" checked={field.value} onChange={field.onChange} />
        )}
      />

      <Input
        type="number"
        step="any"
        icon={PercentSVG}
        label="Creator royalties"
        disabled={!isSellable}
        name={'royalty'}
        className={styles.sellableInput}
      />
    </>
  );
}

function ParametersForm({ defaultValues, onSubmit, onBack }: Props) {
  const { getFormattedBalanceValue, getChainBalanceValue } = useBalanceFormat();
  const { api } = useApi();
  const existentialDeposit = api?.existentialDeposit.toString() || '0';

  const schema = z
    .object({
      mintPermission: z.object({
        value: z.enum(['any', 'admin', 'custom']),
        addresses: z.array(z.object({ value: z.string() })),
      }),
      mintLimit: z.string().trim(),

      mintPrice: z
        .string()
        .transform((value) => getChainBalanceValue(value))
        .refine((value) => value.isEqualTo(0) || value.isGreaterThanOrEqualTo(existentialDeposit), {
          message: `Minimum value is ${getFormattedBalanceValue(existentialDeposit).toFixed()} or 0`,
        })
        .refine((value) => value.isInteger(), 'Maximum amount of decimal places exceeded')
        .transform((value) => getFormattedBalanceValue(value.toFixed()).toFixed()),

      tags: z.object({ value: z.string() }).array().default([]),
      royalty: z.coerce
        .number()
        .max(10)
        .transform((value) => value.toString()),
      isSellable: z.boolean().default(false),
      isTransferable: z.boolean().default(false),
      isMetadataChangesAllowed: z.boolean().default(false),
    })
    .refine(({ mintPermission }) => mintPermission.value !== 'custom' || mintPermission.addresses.length, {
      message: 'No specifed address',
      path: ['mintPermission.value'],
    });

  return (
    <Container maxWidth="sm">
      <h3 className={styles.heading}>Set Collection Parameters</h3>
      <p className={styles.text}>Once the collection is created, they cannot be modified.</p>

      <div className={styles.form}>
        <Form
          onSubmit={(data) => {
            onSubmit(data);
          }}
          schema={schema}
          defaultValues={defaultValues}
          className={styles.form}
        >
          <ParametersFormContent />

          <div className={styles.buttons}>
            <Button text="Back" color="grey" onClick={onBack} />
            <Button type="submit" text="Continue" isLoading={!api} />
          </div>
        </Form>
      </div>
    </Container>
  );
}

export { ParametersForm };
