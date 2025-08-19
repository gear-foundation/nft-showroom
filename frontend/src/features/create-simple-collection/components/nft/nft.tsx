import { Checkbox, Input } from '@gear-js/vara-ui';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { NFTsValues } from '../../types';
import { getFileUrl } from '../../utils';
import { DeleteButton } from '../delete-button';

import styles from './nft.module.scss';

type Props = {
  file: File;
  index: number;
  onDelete: () => void;
  onCheckboxChange: () => void;
};

function NFT({ file, index, onDelete, onCheckboxChange }: Props) {
  const { control } = useFormContext<NFTsValues>();
  const inputName = `nfts.${index}.limit` as const;
  const [isLimitChecked, setIsLimitChecked] = useState(false);

  useEffect(() => {
    if (!isLimitChecked) onCheckboxChange();
  }, [isLimitChecked, onCheckboxChange]);

  return (
    <Controller
      name={inputName}
      control={control}
      render={({ field }) => (
        <li className={styles.nft}>
          <header className={styles.imageWrapper}>
            <img src={getFileUrl(file)} alt="" />
          </header>

          <ul className={styles.options}>
            <li className={styles.option}>
              <Checkbox
                type="switch"
                label="Limit of copies"
                checked={isLimitChecked}
                onChange={() => setIsLimitChecked((prevValue) => !prevValue)}
              />

              <Input
                type="number"
                className={styles.input}
                disabled={!isLimitChecked}
                onChange={field.onChange}
                value={field.value}
                name={inputName}
              />
            </li>
          </ul>

          <DeleteButton className={styles.deleteButton} onClick={onDelete} />
        </li>
      )}
    />
  );
}

export { NFT };
