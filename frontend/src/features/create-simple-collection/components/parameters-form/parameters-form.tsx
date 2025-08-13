import { useApi, useBalanceFormat } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import VaraSVG from '@/assets/vara.svg?react';
import { Checkbox, Container, Form, Input, Select } from '@/components';
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

  const resolver = zodResolver(schema);

  const { control, formState, setValue, clearErrors, watch } = useForm({
    defaultValues,
    resolver,
  });
  const { errors } = formState;

  const { isSellable, tags: tagsValue } = watch();

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

  useEffect(() => {
    if (tagsValue && typeof tagsValue === 'string' && tagsValue !== '' && !isTagSelected(tagsValue)) {
      append({ value: tagsValue });
      setValue('tags', []);
    }
  }, [tagsValue, append, setValue, isTagSelected]);

  const renderTags = () =>
    fields.map(({ value }, index) => (
      <Tag key={value} onRemoveClick={() => remove(index)}>
        {value}
      </Tag>
    ));

  return (
    <Container maxWidth="sm">
      <h3 className={styles.heading}>Set Collection Parameters</h3>
      <p className={styles.text}>Once the collection is created, they cannot be modified.</p>

      <div className={styles.form}>
        <MintPermissionForm
          onChange={(value) => {
            setValue('mintPermission', value);
            clearErrors('mintPermission.value'); // TODO: find clearer way to handle nested forms
          }}
          defaultValues={defaultValues.mintPermission}
          error={errors.mintPermission?.value?.message}
        />

        <Form
          onSubmit={(data) => {
            onSubmit(data);
          }}
          schema={schema}
          defaultValues={defaultValues}
          className={styles.form}
        >
          <Input type="number" step="any" label="Minting limit per user" name={'mintLimit'} />
          <Input type="number" step="any" icon={VaraSVG} label={'Minting price'} name={'mintLimit'} />

          <div>
            <Select name={'tags'} label="Tags" options={[PLACEHOLDER_TAG, ...options]} disabled={!options.length} />

            {Boolean(fields.length) && <ul className={styles.tags}>{renderTags()}</ul>}
          </div>

          <Checkbox label="Allow metadata changes" type="switch" name={'isMetadataChangesAllowed'} />
          <Checkbox label="Allow transferring" type="switch" name={'isTransferable'} disabled={isSellable} />
          <Checkbox label="Allow selling" type="switch" name={'isSellable'} />

          <Input
            type="number"
            step="any"
            icon={PercentSVG}
            label="Creator royalties"
            disabled={!isSellable}
            name={'royalty'}
          />

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
