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
  mintPermission: {
    value: 'any' | 'admin' | 'custom';
    addresses: { value: string }[];
  };
  mintLimit: string;
  mintPrice: string;
  tags: { value: string }[];
  royalty: string;
  isSellable: boolean;
  isTransferable: boolean;
  isVariableMeta: boolean;
};

type NFT = {
  file: File;
  limit: string;
};

type NFTsValues = {
  nfts: NFT[];
};

type CreateCollectionPayload = {
  CreateCollection: {
    typeName: string;
    payload: number[];
  };
};

type CreateCollectionReply = {
  collectionCreated: {
    collectionAddress: string;
  };
};

export type { SummaryValues, ParametersValues, NFT, NFTsValues, CreateCollectionPayload, CreateCollectionReply };
