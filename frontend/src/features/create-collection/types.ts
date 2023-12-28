type SummaryValues = {
  cover: File | undefined;
  logo: File | undefined;
  name: string;
  description: string;
  url: string;
  telegram: string;
  x: string;
  medium: string;
  discord: string;
};

type ParametersValues = {
  mintLimit: string;
  mintPrice: string;
  tags: { value: string }[];
  royalty: string;
  isSellable: boolean;
  isTransferable: boolean;
};

type NFT = {
  file: File;
  limit: string;
};

type NFTsValues = {
  image: FileList | undefined;
  nfts: NFT[];
};

export type { SummaryValues, ParametersValues, NFT, NFTsValues };
