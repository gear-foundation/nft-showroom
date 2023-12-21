import { DEFAULT_PARAMETERS_VALUES } from './consts';

type SummaryValues = {
  cover: FileList | undefined;
  name: string;
  description: string;
};

type ParametersValues = typeof DEFAULT_PARAMETERS_VALUES;

export type { SummaryValues, ParametersValues };
