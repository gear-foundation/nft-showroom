import { Button, Checkbox, Input, Select } from '@gear-js/vara-ui';
import { useApi } from '@gear-js/react-hooks';
import { ChangeEvent, useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import { Container } from '@/components';

import CrossSVG from '../../assets/cross-tag.svg?react';
import { ParametersValues } from '../../types';
import styles from './parameters-form.module.scss';

type Props = {
  defaultValues: ParametersValues;
  onSubmit: (values: ParametersValues) => void;
  onBack: () => void;
};

const PLACEHOLDER_TAG = { value: '', label: 'Select tag' };
const TAGS = ['Game', 'Metaverse', 'Hero'];

function ParametersForm({ defaultValues, onSubmit, onBack }: Props) {
  const { api } = useApi();
  const [unit] = api?.registry.chainTokens || ['Unit'];

  const { control, register, handleSubmit, setValue } = useForm({ defaultValues });
  const isSellable = useWatch({ control, name: 'isSellable' });

  useEffect(() => {
    setValue('royalty', '');
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
        <Input label={`Minting limit per user`} className={styles.input} {...register('mintLimit')} />
        <Input label={`Minting price (${unit})`} className={styles.input} {...register('mintPrice')} />

        <div>
          <Select
            label="Tags"
            options={[PLACEHOLDER_TAG, ...options]}
            className={styles.input}
            onChange={handleTagChange}
            disabled={!options.length}
          />

          <ul className={styles.tags}>{getTags()}</ul>
        </div>

        <Checkbox label="Allow selling" type="switch" {...register('isSellable')} />
        <Checkbox label="Allow transferring" type="switch" {...register('isTransferable')} />

        <Input label="Creator royalties (%)" className={styles.input} disabled={!isSellable} {...register('royalty')} />

        <div className={styles.buttons}>
          <Button text="Back" color="border" onClick={onBack} />
          <Button type="submit" text="Continue" />
        </div>
      </form>
    </Container>
  );
}

export { ParametersForm };
