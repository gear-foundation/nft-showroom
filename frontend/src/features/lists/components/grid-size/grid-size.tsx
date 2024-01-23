import { FilterButton } from '@/components';

import LargeGridSVG from '../../assets/large-grid.svg?react';
import SmallGridSVG from '../../assets/small-grid.svg?react';
import { GRID_SIZE } from '../../consts';
import { GridSize as GridSizeType } from '../../types';

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
      return <FilterButton key={_value} icon={SVG} onClick={() => onChange(_value)} isActive={_value === value} />;
    });

  return <div>{renderButtons()}</div>;
}

export { GridSize };
