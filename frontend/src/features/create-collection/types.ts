type SummaryValues = {
  cover: FileList | undefined;
  name: string;
  description: string;
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
