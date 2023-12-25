import { Button, Input } from '@gear-js/vara-ui';
import { useForm, useWatch } from 'react-hook-form';

import { Container } from '@/components';

import { SummaryValues } from '../../types';
import { useFileUrl, useRegisterRef } from '../../hooks';
import { DeleteButton } from '../delete-button';
import styles from './summary-form.module.scss';

type Props = {
  defaultValues: SummaryValues;
  onSubmit: (values: SummaryValues) => void;
  onBack: () => void;
};

function SummaryForm({ defaultValues, onSubmit, onBack }: Props) {
  const { register, setValue, handleSubmit, control } = useForm({ defaultValues });
  const [ref, inputProps] = useRegisterRef(register('cover'));

  const fileList = useWatch({ name: 'cover', control });
  const url = useFileUrl(fileList);
  const style = { backgroundImage: `url(${url})` };

  const handleFileButtonClick = () => ref.current?.click();
  const handleDeleteFileButtonClick = () => setValue('cover', undefined);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <header className={styles.cover} style={style}>
          {url ? (
            <DeleteButton className={styles.deleteButton} onClick={handleDeleteFileButtonClick} />
          ) : (
            <>
              <h4 className={styles.heading}>Collection Cover</h4>

              <div className={styles.text}>
                <p>Upload a cover image with the recommended dimensions of 1200x260 pixels.</p>
                <p>File formats: .jpg, .jpeg, .png. Max size: 5mb</p>
              </div>

              <input type="file" className={styles.fileInput} ref={ref} {...inputProps} />
              <Button text="Select File" size="small" color="dark" onClick={handleFileButtonClick} />
            </>
          )}

          {/* <button type="button" className={styles.logoButton}>
            <CameraSVG />
          </button> */}
        </header>
      </Container>

      <Container maxWidth="sm" className={styles.inputs}>
        <Input label="Name" className={styles.input} {...register('name')} />
        <Input label="Description" className={styles.input} {...register('description')} />

        <div className={styles.buttons}>
          <Button text="Cancel" color="border" onClick={onBack} />
          <Button type="submit" text="Continue" />
        </div>
      </Container>
    </form>
  );
}

export { SummaryForm };
