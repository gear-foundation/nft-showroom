import { ACCOUNT_FILTER_VALUE, GRID_SIZE } from './consts';

type GridSize = (typeof GRID_SIZE)[keyof typeof GRID_SIZE];

type AccountFilterValue = (typeof ACCOUNT_FILTER_VALUE)[keyof typeof ACCOUNT_FILTER_VALUE];

export type { GridSize, AccountFilterValue };
