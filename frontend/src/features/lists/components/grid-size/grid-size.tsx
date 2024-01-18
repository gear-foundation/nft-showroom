import { Button } from '@gear-js/vara-ui';

import { cx } from '@/utils';

import LargeGridSVG from '../../assets/large-grid.svg?react';
import SmallGridSVG from '../../assets/small-grid.svg?react';
import { GRID_SIZE } from '../../consts';
import { GridSize as GridSizeType } from '../../types';

import styles from './grid-size.module.scss';

const BUTTONS = [
  { SVG: SmallGridSVG, value: GRID_SIZE.SMALL },
  { SVG: LargeGridSVG, value: GRID_SIZE.LARGE },
] as const;

type Props = {
  value: GridSizeType;
  onChange: (value: GridSizeType) => void;
};

function GridSize({ value, onChange }: Props) {
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

export { GridSize };
