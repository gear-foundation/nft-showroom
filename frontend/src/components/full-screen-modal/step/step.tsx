import { cx } from '@/utils';

import styles from './step.module.scss';

type Props = {
  number: number;
  text: string;
  status: 'active' | 'complete' | 'awaiting';
};

function Step({ number, text, status }: Props) {
  return (
    <li className={cx(styles.step, styles[status])} data-number={number}>
      {text}
    </li>
  );
}

export { Step };
