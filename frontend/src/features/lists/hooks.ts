import { useState } from 'react';

import { GRID_SIZE } from './consts';
import { GridSize } from './types';

function useGridSize() {
  const [gridSize, setGridSize] = useState<GridSize>(GRID_SIZE.SMALL);

  return { gridSize, setGridSize };
}

export { useGridSize };
