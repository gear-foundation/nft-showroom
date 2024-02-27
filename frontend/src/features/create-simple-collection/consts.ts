import { NFTsValues, ParametersValues, SummaryValues } from './types';

const COLLECTION_TYPE_NAME = {
  SIMPLE: 'Simple NFT Collection',
};

const STEPS = ['Fill info', 'Set parameters', 'Add NFTs'];

const DEFAULT_SUMMARY_VALUES: SummaryValues = {
  cover: undefined,
  logo: undefined,
  name: '',
  description: '',
  url: '',
  telegram: '',
  x: '',
  medium: '',
  discord: '',
};

const DEFAULT_PARAMETERS_VALUES: ParametersValues = {
  mintPermission: {
    value: 'any',
    addresses: [],
  },
  mintLimit: '',
  mintPrice: '0',
  royalty: '0',
  tags: [],
  isSellable: false,
  isTransferable: false,
};

const DEFAULT_NFTS_VALUES: NFTsValues = {
  nfts: [],
};

const MAX_IMAGE_SIZE_MB = 5;
const IMAGE_TYPES = ['image/svg+xml', 'image/png', 'image/jpeg'];
const IMAGE_TYPES_ACCEPT = IMAGE_TYPES.join(', ');

export {
  COLLECTION_TYPE_NAME,
  STEPS,
  DEFAULT_SUMMARY_VALUES,
  DEFAULT_PARAMETERS_VALUES,
  DEFAULT_NFTS_VALUES,
  IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  IMAGE_TYPES_ACCEPT,
};
