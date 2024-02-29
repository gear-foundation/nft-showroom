import { Container } from '@/components';
import { CreateCollection as CreateCollectionFeature } from '@/features/create-collection';

import styles from './create-collection.module.scss';

function CreateCollection() {
  return (
    <Container maxWidth="sm">
      <h2 className={styles.heading}>Create Collection</h2>

      <p className={styles.text}>
        Choose your collection type: Simple NFT for pre-existing images, Composable NFT to generate layers and
        compositions, or NFT Collections for Music Creators to craft musical NFTs.
      </p>

      <CreateCollectionFeature />
    </Container>
  );
}

export { CreateCollection };
