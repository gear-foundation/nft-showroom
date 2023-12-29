import PictureSVG from './assets/picture.svg?react';
import NoteSVG from './assets/note.svg?react';
import PuzzleSVG from './assets/puzzle.svg?react';

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

export { COLLECTION_TYPES };
