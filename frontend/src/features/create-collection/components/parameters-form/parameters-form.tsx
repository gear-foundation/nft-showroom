import { useForm } from 'react-hook-form';
import styles from './parameters-form.module.scss';
import { Button, Input } from '@gear-js/vara-ui';
import { Container } from '@/components';
import { ParametersValues } from '../../types';
import { useApi } from '@gear-js/react-hooks';

type Props = {
  defaultValues: ParametersValues;
  onSubmit: (values: ParametersValues) => void;
};

function ParametersForm({ defaultValues, onSubmit }: Props) {
  const { api } = useApi();
  const [unit] = api?.registry.chainTokens || ['Unit'];

  const { register, handleSubmit } = useForm({ defaultValues });

  return (
    <Container maxWidth="sm">
      <h3 className={styles.heading}>Set Collection Parameters</h3>
      <p className={styles.text}>Once the collection is created, they cannot be modified.</p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input label={`Minting price (${unit})`} className={styles.input} {...register('mintPrice')} />
        <Input label="Minting limit per user" className={styles.input} {...register('mintLimit')} />
        <Input label="Creator royalties (%)" className={styles.input} {...register('royalty')} />

        <div className={styles.buttons}>
          <Button text="Back" color="border" />
          <Button type="submit" text="Continue" />
        </div>
      </form>
    </Container>
  );
}

export { ParametersForm };
