import { Button } from '@gear-js/vara-ui';
import { useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import { Container } from '@/components';

import { useRegisterRef } from '../../hooks';
import { NFTsValues } from '../../types';
import { NFT } from '../nft';
import styles from './nft-form.module.scss';

type Props = {
  defaultValues: NFTsValues;
  isLoading: boolean;
  onSubmit: (values: NFTsValues) => void;
  onBack: () => void;
};

function NFTForm({ defaultValues, isLoading, onSubmit, onBack }: Props) {
  const { control, register, setValue, handleSubmit } = useForm({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: 'nfts' });
  const nftsCount = fields.length;

  const [ref, inputProps] = useRegisterRef(register('image'));
  const imageValue = useWatch({ control, name: 'image' });

  useEffect(() => {
    if (!imageValue || !imageValue.length) return;

    const [file] = imageValue;
    const limit = '';

    append({ file, limit });
    setValue('image', undefined);
  }, [imageValue, append, setValue]);

  const handleFileButtonClick = () => ref.current?.click();

  const getNfts = () =>
    fields.map(({ id, file }, index) => {
      const inputName = `nfts.${index}.limit` as const;

      return (
        <NFT
          key={id}
          src={URL.createObjectURL(file)}
          inputProps={register(inputName)}
          onDelete={() => remove(index)}
          onCheckboxChange={() => setValue(inputName, '')}
        />
      );
    });

  return (
    <Container>
      <form onSubmit={handleSubmit((data) => onSubmit({ ...data, image: undefined }))}>
        <header className={styles.header}>
          <h4 className={styles.heading}>NFTs added: {nftsCount}</h4>

          <div className={styles.file}>
            <input type="file" className={styles.fileInput} ref={ref} {...inputProps} />
            <Button text="Select File" size="small" color="dark" onClick={handleFileButtonClick} />

            <p>File formats: .jpg, .jpeg, .png. Max size: 5mb</p>
          </div>
        </header>

        <ul className={styles.nfts}>{getNfts()}</ul>

        <Container maxWidth="sm" className={styles.buttons}>
          <Button text="Back" color="border" onClick={onBack} />

          {nftsCount > 0 && <Button type="submit" text="Submit" isLoading={isLoading} />}
        </Container>
      </form>
    </Container>
  );
}

export { NFTForm };
