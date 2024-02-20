import { Container } from '@/components';
import { CreateAICollection, CreateSimpleCollection } from '@/features/create-simple-collection';

import styles from './create-collection.module.scss';

function CreateCollection() {
  return (
    <Container maxWidth="sm">
      <h2 className={styles.heading}>Create Collection</h2>

      <p className={styles.text}>
        Choose your collection type: Simple NFT for pre-existing images, Composable NFT to generate layers and
        compositions, or NFT Collections for Music Creators to craft musical NFTs.
      </p>

      <ul className={styles.collections}>
        <li>
          <CreateSimpleCollection />
        </li>
        <li>
          <CreateAICollection />
        </li>
      </ul>
    </Container>
  );
}

export { CreateCollection };
