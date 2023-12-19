import { Container } from '@/components';

import PictureSVG from './picture.svg?react';
import NoteSVG from './note.svg?react';
import PuzzleSVG from './puzzle.svg?react';

import { CollectionTypeButton } from './collection-type-button';
import styles from './create-collection.module.scss';

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

function CreateCollection() {
  const getCollectionTypes = () =>
    COLLECTION_TYPES.map((type) => (
      <li key={type.tag}>
        <CollectionTypeButton {...type} />
      </li>
    ));

  return (
    <Container maxWidth="sm">
      <h2 className={styles.heading}>Create Collection</h2>

      <p className={styles.text}>
        Choose your collection type: Simple NFT for pre-existing images, Composable NFT to generate layers and
        compositions, or NFT Collections for Music Creators to craft musical NFTs.
      </p>

      <ul className={styles.buttons}>{getCollectionTypes()}</ul>
    </Container>
  );
}

export { CreateCollection };
