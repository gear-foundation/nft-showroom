type SummaryValues = {
  cover: FileList | undefined;
  logo: FileList | undefined;
  name: string;
  description: string;
  url: string;
  telegram: string;
  x: string;
  medium: string;
  discord: string;
};

type ParametersValues = {
  mintPrice: string;
  royalty: string;
};

type NFT = {
  url: string;
  limit: string;
};

type NFTsValues = {
  image: FileList | undefined;
  nfts: NFT[];
};

export type { SummaryValues, ParametersValues, NFTsValues };
