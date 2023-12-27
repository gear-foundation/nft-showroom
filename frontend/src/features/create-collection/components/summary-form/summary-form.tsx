import { Button, Input, Textarea } from '@gear-js/vara-ui';
import { useForm, useWatch } from 'react-hook-form';

import { Container } from '@/components';

import CameraSVG from '../../assets/camera.svg?react';
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

  const [coverRef, coverInputProps] = useRegisterRef(register('cover'));
  const coverFileList = useWatch({ name: 'cover', control });
  const coverUrl = useFileUrl(coverFileList);
  const coverStyle = { backgroundImage: `url(${coverUrl})` };
  const handleCoverButtonClick = () => coverRef.current?.click();
  const handleDeleteCoverButtonClick = () => setValue('cover', undefined);

  const [logoRef, logoInputProps] = useRegisterRef(register('logo'));
  const logoFileList = useWatch({ name: 'logo', control });
  const logoUrl = useFileUrl(logoFileList);
  const logoStyle = { backgroundImage: `url(${logoUrl})` };
  const handleLogoButtonClick = () => logoRef.current?.click();
  const handleDeleteLogoButtonClick = () => setValue('logo', undefined);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Container>
        <header className={styles.cover} style={coverStyle}>
          {coverUrl ? (
            <DeleteButton className={styles.deleteButton} onClick={handleDeleteCoverButtonClick} />
          ) : (
            <>
              <h4 className={styles.heading}>Collection Cover</h4>

              <div className={styles.text}>
                <p>Upload a cover image with the recommended dimensions of 1200x260 pixels.</p>
                <p>File formats: .jpg, .jpeg, .png. Max size: 5mb</p>
              </div>

              <input type="file" className={styles.fileInput} ref={coverRef} {...coverInputProps} />
              <Button text="Select File" size="small" color="dark" onClick={handleCoverButtonClick} />
            </>
          )}

          <div className={styles.logo}>
            <input type="file" className={styles.fileInput} ref={logoRef} {...logoInputProps} />
            <button type="button" className={styles.button} onClick={handleLogoButtonClick} style={logoStyle}>
              {!logoUrl && <CameraSVG />}
            </button>

            {logoUrl && <DeleteButton className={styles.deleteButton} onClick={handleDeleteLogoButtonClick} />}
          </div>
        </header>
      </Container>

      <Container maxWidth="sm" className={styles.inputs}>
        <div className={styles.inputs}>
          <Input label="Name" className={styles.input} {...register('name')} />
          <Textarea label="Description" rows={2} className={styles.input} {...register('description')} />
        </div>

        <div className={styles.inputs}>
          <h4 className={styles.heading}>Links (optional):</h4>
          <Input label="URL" className={styles.input} {...register('url')} />
          <Input label="Telegram" className={styles.input} {...register('telegram')} />
          <Input label="X.com" className={styles.input} {...register('x')} />
          <Input label="Medium" className={styles.input} {...register('medium')} />
          <Input label="Discord" className={styles.input} {...register('discord')} />
        </div>

        <div className={styles.buttons}>
          <Button text="Cancel" color="border" onClick={onBack} />
          <Button type="submit" text="Continue" />
        </div>
      </Container>
    </form>
  );
}

export { SummaryForm };
