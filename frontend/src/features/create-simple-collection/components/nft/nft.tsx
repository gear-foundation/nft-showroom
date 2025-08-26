import { Checkbox as VaraCheckbox } from '@gear-js/vara-ui';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components';

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
  const { setValue, watch } = useFormContext<NFTsValues>();
  const inputName = `nfts.${index}.limit` as const;
  const limitValue = watch(inputName);
  const isLimitChecked = Boolean(limitValue);

  useEffect(() => {
    if (!isLimitChecked) onCheckboxChange();
  }, [isLimitChecked, onCheckboxChange]);

  const handleCheckboxChange = () => {
    const newValue = !isLimitChecked;
    if (!newValue) {
      setValue(inputName, '');
    } else {
      setValue(inputName, '1');
    }
  };

  return (
    <li className={styles.nft}>
      <header className={styles.imageWrapper}>
        <img src={getFileUrl(file)} alt="" />
      </header>

      <ul className={styles.options}>
        <li className={styles.option}>
          <VaraCheckbox
            type="switch"
            label="Limit of copies"
            checked={isLimitChecked}
            onChange={handleCheckboxChange}
          />

          <Input type="number" className={styles.input} disabled={!isLimitChecked} name={inputName} />
        </li>
      </ul>

      <DeleteButton className={styles.deleteButton} onClick={onDelete} />
    </li>
  );
}

export { NFT };
