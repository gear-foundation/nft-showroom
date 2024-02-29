import { useAccount } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { ACCOUNT_FILTER_VALUE, GRID_SIZE } from './consts';
import { AccountFilterValue, GridSize } from './types';

function useGridSize() {
  const [gridSize, setGridSize] = useState<GridSize>(GRID_SIZE.SMALL);

  return { gridSize, setGridSize };
}

function useAccountFilter() {
  const { account } = useAccount();
  // probably better to use '' | accountAddress instead of 'all' | 'my' values
  const [accountFilterValue, setAccountFilterValue] = useState<AccountFilterValue>(ACCOUNT_FILTER_VALUE.ALL);

  const accountFilterAddress = account && accountFilterValue === 'my' ? account.decodedAddress : '';

  useEffect(() => {
    if (!account) setAccountFilterValue(ACCOUNT_FILTER_VALUE.ALL);
  }, [account]);

  return { accountFilterValue, setAccountFilterValue, accountFilterAddress };
}

export { useGridSize, useAccountFilter };
