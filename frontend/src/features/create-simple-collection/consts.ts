import { DictionaryValues, NFTsValues, ParametersValues, SummaryValues } from './types';

const COLLECTION_NAME = {
  SIMPLE: 'Simple NFT Collection',
  AI: 'AI NFT Collection',
};

// TODO: get collection type metadata
// we don't need code id actually, name can be used as identifier
const COLLECTION_CODE_ID = {
  SIMPLE: '0x45c6b76956d38a14530a755ed6ca5b5f143d47f7a7d011b17cee740fe42c8f45',
  AI: '0x70e5f77ccfb91cac8ed6b70f017ac5317b48de6cdc59b0e67e6f00549872293f',
};

const STEPS = {
  SIMPLE: ['Fill info', 'Set parameters', 'Add NFTs'],
  AI: ['Fill info', 'Set parameters', 'Add dictionary'],
};

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
  mintPrice: '',
  royalty: '',
  tags: [],
  isSellable: false,
  isTransferable: false,
};

const DEFAULT_NFTS_VALUES: NFTsValues = {
  nfts: [],
};

const DEFAULT_DICTIONARY_VALUES: DictionaryValues = {
  words: [],
};

const MAX_IMAGE_SIZE_MB = 5;
const IMAGE_TYPES = ['image/svg+xml', 'image/png', 'image/jpeg'];
const IMAGE_TYPES_ACCEPT = IMAGE_TYPES.join(', ');

export {
  COLLECTION_NAME,
  COLLECTION_CODE_ID,
  STEPS,
  DEFAULT_SUMMARY_VALUES,
  DEFAULT_PARAMETERS_VALUES,
  DEFAULT_NFTS_VALUES,
  DEFAULT_DICTIONARY_VALUES,
  IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  IMAGE_TYPES_ACCEPT,
};
