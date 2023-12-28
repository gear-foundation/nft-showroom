import { Button, Checkbox, Input, Select } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import VaraSVG from '@/assets/vara.svg?react';
import { Container } from '@/components';

import PercentSVG from '../../assets/percent.svg?react';
import CrossSVG from '../../assets/cross-tag.svg?react';
import { useChangeEffect } from '../../hooks';
import { ParametersValues } from '../../types';
import styles from './parameters-form.module.scss';

type Props = {
  defaultValues: ParametersValues;
  onSubmit: (values: ParametersValues) => void;
  onBack: () => void;
};

const PLACEHOLDER_TAG = { value: '', label: 'Select tag' };
const TAGS = ['Game', 'Metaverse', 'Hero'];

const schema = z.object({
  mintLimit: z.string().trim(),
  mintPrice: z.string().trim(),
  tags: z.array(z.object({ value: z.string() })),
  royalty: z.coerce
    .number()
    .max(100)
    .transform((value) => value.toString()),
  isSellable: z.boolean(),
  isTransferable: z.boolean(),
});

const resolver = zodResolver(schema);

function ParametersForm({ defaultValues, onSubmit, onBack }: Props) {
  const { control, formState, register, handleSubmit, setValue } = useForm({ defaultValues, resolver });
  const { errors } = formState;
  const isSellable = useWatch({ control, name: 'isSellable' });

  useChangeEffect(() => {
    setValue('royalty', '');
    setValue('isTransferable', isSellable);
  }, [isSellable, setValue]);

  const { fields, append, remove } = useFieldArray({ control, name: 'tags' });
  const isTagSelected = (value: string) => fields.some((tag) => value === tag.value);
  const options = TAGS.filter((value) => !isTagSelected(value)).map((value) => ({ value, label: value }));

  const handleTagChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    append({ value: target.value });
    target.value = ''; // reset to placeholder value, since selected options will be deleted
  };

  const getTags = () =>
    fields.map(({ value }, index) => (
      <li key={value} className={styles.tag}>
        {value}

        <Button icon={CrossSVG} color="transparent" onClick={() => remove(index)} />
      </li>
    ));

  return (
    <Container maxWidth="sm">
      <h3 className={styles.heading}>Set Collection Parameters</h3>
      <p className={styles.text}>Once the collection is created, they cannot be modified.</p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input type="number" label={`Minting limit per user`} {...register('mintLimit')} />
        <Input type="number" icon={VaraSVG} label={'Minting price'} {...register('mintPrice')} />

        <div>
          <Select
            label="Tags"
            options={[PLACEHOLDER_TAG, ...options]}
            onChange={handleTagChange}
            disabled={!options.length}
          />

          <ul className={styles.tags}>{getTags()}</ul>
        </div>

        <Checkbox label="Allow transferring" type="switch" {...register('isTransferable')} disabled={isSellable} />
        <Checkbox label="Allow selling" type="switch" {...register('isSellable')} />

        <Input
          type="number"
          icon={PercentSVG}
          label="Creator royalties"
          disabled={!isSellable}
          {...register('royalty')}
          error={errors.royalty?.message}
        />

        <div className={styles.buttons}>
          <Button text="Back" color="border" onClick={onBack} />
          <Button type="submit" text="Continue" />
        </div>
      </form>
    </Container>
  );
}

export { ParametersForm };
