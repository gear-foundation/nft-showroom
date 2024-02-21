import { Button, Input } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Container } from '@/components';

import { DictionaryValues } from '../../types';
import { Tag } from '../tag';

import styles from './dictionary-form.module.scss';

type Values = {
  word: string;
  words: { value: string }[];
};

const isSingleWord = (value: string) => /^[a-z]+$/i.test(value);

const schema = z
  .object({
    word: z
      .string()
      .trim()
      .refine((value) => isSingleWord(value), 'Input must consist of only letters'),
    words: z.array(z.object({ value: z.string() })),
  })
  .refine(({ word, words }) => !words.find(({ value }) => value === word), {
    message: 'Word already exists',
    path: ['word'],
  });

const resolver = zodResolver(schema);

type Props = {
  defaultValues: DictionaryValues;
  isLoading: boolean;
  onSubmit: (words: { value: string }[]) => void;
  onBack: () => void;
};

function DictionaryForm({ defaultValues, isLoading, onSubmit, onBack }: Props) {
  const { control, formState, handleSubmit, register, resetField } = useForm({
    defaultValues: { ...defaultValues, word: '' },
    resolver,
  });
  const { errors } = formState;

  const { fields, append, remove } = useFieldArray({ control, name: 'words' });
  const wordsCount = fields.length;

  const renderWords = () =>
    fields.map(({ value }, index) => (
      <Tag key={value} onRemoveClick={() => remove(index)}>
        <span>{value}</span>
      </Tag>
    ));

  const onWordSubmit = ({ word }: Values) => {
    append({ value: word });
    resetField('word');
  };

  return (
    <Container maxWidth="sm" className={styles.form}>
      <div>
        <form onSubmit={handleSubmit(onWordSubmit)} className={styles.addWord}>
          <Input label="Word" {...register('word')} error={errors.word?.message} />
          <Button type="submit" text="Add" color="border" />
        </form>

        {Boolean(wordsCount) && (
          <div>
            <h3 className={styles.heading}>AI Word Bank ({wordsCount}):</h3>
            <ul className={styles.words}>{renderWords()}</ul>
          </div>
        )}
      </div>

      <div className={styles.buttons}>
        <Button text="Back" color="border" onClick={onBack} />
        <Button text="Submit" onClick={() => onSubmit(fields)} isLoading={isLoading} />
      </div>
    </Container>
  );
}

export { DictionaryForm };
