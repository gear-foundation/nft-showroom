import { Button } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Container } from '@/components';

import { IMAGE_TYPES } from '../../consts';
import { useImageInput } from '../../hooks';
import { NFTsValues } from '../../types';
import { getFileUrl } from '../../utils';
import { NFT } from '../nft';

import styles from './nft-form.module.scss';

type Props = {
  defaultValues: NFTsValues;
  isLoading: boolean;
  onSubmit: (values: NFTsValues) => void;
  onBack: () => void;
};

const schema = z.object({
  nfts: z.array(
    z.object({
      file: z.custom<File>(),
      limit: z.string().trim(),
    }),
  ),
});

const resolver = zodResolver(schema);

function NFTForm({ defaultValues, isLoading, onSubmit, onBack }: Props) {
  const { control, register, setValue, handleSubmit } = useForm({ defaultValues, resolver });
  const { fields, append, remove } = useFieldArray({ control, name: 'nfts' });
  const nftsCount = fields.length;

  const image = useImageInput(undefined, IMAGE_TYPES);

  useEffect(() => {
    if (!image.value) return;

    const file = image.value;
    const limit = '';

    append({ file, limit });
    image.handleReset();
  }, [image, append, setValue]);

  const getNfts = () =>
    fields.map(({ id, file }, index) => {
      const inputName = `nfts.${index}.limit` as const;

      return (
        <NFT
          key={id}
          src={getFileUrl(file)}
          inputProps={register(inputName)}
          onDelete={() => remove(index)}
          onCheckboxChange={() => setValue(inputName, '')}
        />
      );
    });

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <header className={styles.header}>
          <h4 className={styles.heading}>NFTs added: {nftsCount}</h4>

          <div className={styles.file}>
            <input type="file" className={styles.fileInput} {...image.props} />
            <Button text="Select File" size="small" color="dark" onClick={image.handleClick} />

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
