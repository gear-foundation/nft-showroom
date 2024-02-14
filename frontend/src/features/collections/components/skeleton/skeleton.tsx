import { ReactNode } from 'react';

import styles from './skeleton.module.scss';

type Props = {
  children: ReactNode;
};

function Skeleton({ children }: Props) {
  return <div className={styles.skeleton}>{children}</div>;
}

export { Skeleton };
