import { Button } from '@gear-js/vara-ui';
import { ReactNode } from 'react';

import CrossSVG from '../../assets/cross-tag.svg?react';

import styles from './tag.module.scss';

type Props = {
  children: ReactNode;
  onRemoveClick: () => void;
};

function Tag({ children, onRemoveClick }: Props) {
  return (
    <li className={styles.tag}>
      {children}

      <Button icon={CrossSVG} color="transparent" onClick={onRemoveClick} />
    </li>
  );
}

export { Tag };
