import { Button } from '@gear-js/vara-ui';

import { SVGComponent } from '@/types';
import { cx } from '@/utils';

import styles from './filter-button.module.scss';

type Props = {
  isActive: boolean;
  onClick: () => void;
} & (
  | {
      text: string;
    }
  | { icon: SVGComponent }
);

function FilterButton({ isActive, ...props }: Props) {
  return (
    <Button
      color="grey"
      size="small"
      className={cx(styles.button, isActive && styles.active, 'icon' in props && styles.square)}
      {...props}
    />
  );
}

export { FilterButton };
