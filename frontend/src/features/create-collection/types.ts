import { DEFAULT_PARAMETERS_VALUES } from './consts';

type SummaryValues = {
  cover: FileList | undefined;
  name: string;
  description: string;
};

type ParametersValues = typeof DEFAULT_PARAMETERS_VALUES;

type NFT = {
  url: string;
  limit: string;
};

type NFTsValues = {
  image: FileList | undefined;
  nfts: NFT[];
};

export type { SummaryValues, ParametersValues, NFTsValues };
