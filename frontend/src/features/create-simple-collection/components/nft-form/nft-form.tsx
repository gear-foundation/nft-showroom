import { useAlert, useApi, useBalanceFormat } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, useRef } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Balance, Container } from '@/components';
import { useMarketplace } from '@/context';

import { IMAGE_TYPES, MAX } from '../../consts';
import { NFTsValues } from '../../types';
import { getBytes } from '../../utils';
import { NFT } from '../nft';

import styles from './nft-form.module.scss';

type Props = {
  defaultValues: NFTsValues;
  isLoading: boolean;
  onSubmit: (values: NFTsValues, fee: bigint) => void;
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
  const methods = useForm({ defaultValues, resolver });
  const { control, setValue, handleSubmit } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: 'nfts' });
  const nftsCount = fields.length;

  const alert = useAlert();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputClick = () => inputRef?.current?.click();
  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const files = [...(target.files || [])];

    const potentialNftsCount = nftsCount + files.length;
    if (potentialNftsCount > MAX.NFTS_COUNT) return alert.error(`Maximum number of NFTs is ${MAX.NFTS_COUNT}`);

    files.forEach((file) => {
      const { type, size, name } = file;

      const isValid = size <= getBytes(MAX.SIZE_MB.IMAGE) && IMAGE_TYPES.includes(type);
      if (!isValid) return alert.error(`${name} - max size is exceeded or wrong format`);

      const limit = '';
      append({ file, limit });
    });

    target.value = '';
  };

  // TODO: better to calculate only if loaded?
  const { marketplace } = useMarketplace();
  const feePerUploadedFile = marketplace?.config.feePerUploadedFile || '0';

  const { api } = useApi();
  const { getChainBalanceValue } = useBalanceFormat();
  const existentialDeposit = BigInt(api?.existentialDeposit.toString() || '0');

  const potentialFee = BigInt(feePerUploadedFile) * BigInt(nftsCount);
  const oneVara = BigInt(getChainBalanceValue(1).toFixed());
  const fee = oneVara + (potentialFee > existentialDeposit ? potentialFee : existentialDeposit);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((values) => {
          onSubmit(values, fee);
        })}
        className={styles.form}
      >
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

              <Button text="Select File" size="small" color="contrast" onClick={handleInputClick} />

              <p>File formats: .jpg, .jpeg, .png. Max size: 5mb</p>
            </div>
          </header>
          <ul className={styles.nfts}>
            {fields.map(({ id, file }, index) => {
              const inputName = `nfts.${index}.limit` as const;

              return (
                <NFT
                  key={id}
                  file={file}
                  index={index}
                  onDelete={() => remove(index)}
                  onCheckboxChange={() => setValue(inputName, '')}
                />
              );
            })}
          </ul>
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

              <Button
                type="submit"
                text={isLoading ? 'Uploading...' : 'Submit'}
                isLoading={isLoading}
                disabled={nftsCount === 0}
              />
            </div>
          </Container>
        </footer>
      </form>
    </FormProvider>
  );
}

export { NFTForm };
