import { Checkbox, Input } from '@gear-js/vara-ui';
import { UseFormRegisterReturn } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { DeleteButton } from '../delete-button';
import styles from './nft.module.scss';

type Props = {
  src: string;
  inputProps: UseFormRegisterReturn;
  onDelete: () => void;
  onCheckboxChange: () => void;
};

function NFT({ src, inputProps, onDelete, onCheckboxChange }: Props) {
  const [isLimitChecked, setIsLimitChecked] = useState(false);

  useEffect(() => {
    if (!isLimitChecked) onCheckboxChange();
  }, [isLimitChecked, onCheckboxChange]);

  return (
    <li className={styles.nft}>
      <header className={styles.imageWrapper}>
        <img src={src} alt="" />
      </header>

      <ul className={styles.options}>
        <li className={styles.option}>
          <Checkbox
            type="switch"
            label="Limit of copies"
            checked={isLimitChecked}
            onChange={() => setIsLimitChecked((prevValue) => !prevValue)}
          />

          <Input type="number" className={styles.input} disabled={!isLimitChecked} {...inputProps} />
        </li>
      </ul>

      <DeleteButton className={styles.deleteButton} onClick={onDelete} />
    </li>
  );
}

export { NFT };
