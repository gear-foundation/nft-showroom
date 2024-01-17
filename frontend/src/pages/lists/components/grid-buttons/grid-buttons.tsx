import { Button } from '@gear-js/vara-ui';

import { cx } from '@/utils';

import styles from './grid-buttons.module.scss';
import LargeGridSVG from './large-grid.svg?react';
import SmallGridSVG from './small-grid.svg?react';

const BUTTONS = [
  { SVG: SmallGridSVG, value: 'small' },
  { SVG: LargeGridSVG, value: 'large' },
] as const;

type Props = {
  value: 'small' | 'large';
  onChange: (value: 'small' | 'large') => void;
};

function GridButtons({ value, onChange }: Props) {
  const renderButtons = () =>
    BUTTONS.map(({ value: _value, SVG }) => {
      const isActive = _value === value;
      const color = isActive ? 'grey' : 'transparent';

      return (
        <li key={_value}>
          <Button
            icon={SVG}
            color={color}
            size="small"
            onClick={() => onChange(_value)}
            className={cx(styles.button, isActive && styles.active)}
          />
        </li>
      );
    });

  return <ul className={styles.buttons}>{renderButtons()}</ul>;
}

export { GridButtons };
