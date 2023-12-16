import { ReactNode } from 'react';

import { cx } from '@/utils';

import styles from './container.module.scss';

type Props = {
  children: ReactNode;
  className?: string;
};

function Container({ children, className }: Props) {
  return <div className={cx(styles.container, className)}>{children}</div>;
}

export { Container };
