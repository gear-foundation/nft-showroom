import { cx } from '@/utils';

import styles from './tabs.module.scss';

type Props = {
  list: string[];
  value: number;
  size?: 'small' | 'large';
  outlined?: boolean;
  className?: string;
  onChange: (index: number) => void;
};

function Tabs({ list, value, size = 'large', outlined, className, onChange }: Props) {
  const renderButtons = () =>
    list.map((button, index) => {
      const isActive = index === value;

      return (
        <li key={button}>
          <button
            type="button"
            className={cx(styles.button, isActive && styles.active)}
            onClick={() => onChange(index)}>
            {button}
          </button>
        </li>
      );
    });

  return <ul className={cx(styles.list, styles[size], outlined && styles.outlined, className)}>{renderButtons()}</ul>;
}

export { Tabs };
