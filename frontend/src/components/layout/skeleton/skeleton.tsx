import { ReactNode } from 'react';

import styles from './skeleton.module.scss';

type Props = {
  width?: string;
  height?: string;
  borderRadius?: string;
  children?: ReactNode;
};

function Skeleton({ width, height, borderRadius, children }: Props) {
  return (
    <span className={styles.skeleton} style={{ width, height, borderRadius }}>
      {children}
    </span>
  );
}

export { Skeleton };
