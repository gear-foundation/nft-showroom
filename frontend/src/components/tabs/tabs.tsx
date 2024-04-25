import { cx } from '@/utils';

import styles from './tabs.module.scss';

type Tab = {
  title: string;
  disabled?: boolean;
};

type Props = {
  list: Tab[];
  value: number;
  size?: 'small' | 'large';
  outlined?: boolean;
  className?: string;
  onChange: (index: number) => void;
};

function Tabs({ list, value, size = 'large', outlined, className, onChange }: Props) {
  const renderButtons = () =>
    list.map(({ title, disabled }, index) => {
      const isActive = index === value;

      return (
        <li key={title}>
          <button
            type="button"
            className={cx(styles.button, isActive && styles.active)}
            onClick={() => onChange(index)}
            disabled={disabled}>
            {title}
          </button>
        </li>
      );
    });

  return <ul className={cx(styles.list, styles[size], outlined && styles.outlined, className)}>{renderButtons()}</ul>;
}

export { Tabs };
