import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQuery } from 'urql';
import { z } from 'zod';

import { Balance, Container } from '@/components';
import { graphql } from '@/graphql';

import { IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '../../consts';
import { NFTsValues } from '../../types';
import { getBytesSize, getFileUrl } from '../../utils';
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

const CONFIG_QUERY = graphql(`
  query ConfigQuery {
    marketplaceById(id: "1") {
      config {
        feePerUploadedFile
      }
    }
  }
`);

function useConfig() {
  const [result] = useQuery({ query: CONFIG_QUERY });

  return result.data?.marketplaceById?.config;
}

function NFTForm({ defaultValues, isLoading, onSubmit, onBack }: Props) {
  const { control, register, setValue, handleSubmit } = useForm({ defaultValues, resolver });
  const { fields, append, remove } = useFieldArray({ control, name: 'nfts' });
  const nftsCount = fields.length;

  const alert = useAlert();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputClick = () => inputRef?.current?.click();
  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const files = [...(target.files || [])];

    files.forEach((file) => {
      const { type, size, name } = file;

      const isValid = size <= getBytesSize(MAX_IMAGE_SIZE_MB) && IMAGE_TYPES.includes(type);
      if (!isValid) return alert.error(`${name} - max size is exceeded or wrong format`);

      const limit = '';
      append({ file, limit });
    });

    target.value = '';
  };

  const renderNfts = () =>
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

  const config = useConfig();
  const { feePerUploadedFile } = config || {};

  const fee = feePerUploadedFile ? Number(feePerUploadedFile) * nftsCount : 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Container>
        <header className={styles.header}>
          <h4 className={styles.heading}>NFTs added: {nftsCount}</h4>

          <div className={styles.file}>
            <input
              type="file"
              className={styles.fileInput}
              ref={inputRef}
              onChange={handleInputChange}
              accept={IMAGE_TYPES.join(',')}
              multiple
            />

            <Button text="Select File" size="small" color="dark" onClick={handleInputClick} />

            <p>File formats: .jpg, .jpeg, .png. Max size: 5mb</p>
          </div>
        </header>
        <ul className={styles.nfts}>{renderNfts()}</ul>
      </Container>

      <footer className={styles.footer}>
        <Container className={styles.buttons}>
          <Button text="Back" color="grey" onClick={onBack} />

          <div className={styles.submit}>
            <div>
              <h4 className={styles.submitHeading}>
                Creation fee: <Balance value={fee} />
              </h4>

              <p className={styles.submitText}>Calculated based on the number of unique images.</p>
            </div>

            <Button type="submit" text="Submit" isLoading={isLoading} disabled={nftsCount === 0} />
          </div>
        </Container>
      </footer>
    </form>
  );
}

export { NFTForm };
