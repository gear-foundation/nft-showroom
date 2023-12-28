import PictureSVG from './assets/picture.svg?react';
import NoteSVG from './assets/note.svg?react';
import PuzzleSVG from './assets/puzzle.svg?react';
import { NFTsValues, ParametersValues, SummaryValues } from './types';

const COLLECTION_TYPES = [
  {
    heading: 'Simple NFT collection',
    text: 'Create unique compositions by using a single image or combining multiple, with the ability to customize repetition for each.',
    tag: 'gNFT',
    SVG: PictureSVG,
  },

  {
    heading: 'Composable NFT collection',
    text: 'Allows to combine and customize individual NFTs to create unique compositions, adding a layer of creativity to the digital assets.',
    tag: 'gCNFT',
    SVG: PuzzleSVG,
  },
  {
    heading: 'NFT Collection for Music creators',
    text: 'Upload MP3 music compositions and fine-tune demo playback parameters for a personalized and immersive experience.',
    tag: 'gMNFT',
    SVG: NoteSVG,
  },
];

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
  mintLimit: '',
  mintPrice: '',
  royalty: '',
  tags: [],
  isSellable: false,
  isTransferable: false,
};

const DEFAULT_NFTS_VALUES: NFTsValues = {
  image: undefined,
  nfts: [],
};

const MAX_IMAGE_SIZE_MB = 5;
const IMAGE_TYPES = ['image/svg+xml', 'image/png', 'image/jpeg'];
const IMAGE_TYPES_ACCEPT = IMAGE_TYPES.join(', ');

export {
  COLLECTION_TYPES,
  STEPS,
  DEFAULT_SUMMARY_VALUES,
  DEFAULT_PARAMETERS_VALUES,
  DEFAULT_NFTS_VALUES,
  IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  IMAGE_TYPES_ACCEPT,
};
