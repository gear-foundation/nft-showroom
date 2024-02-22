import { Container } from '@/components';
import { CreateCollection as CollectionType } from '@/features/create-simple-collection';

import { COLLECTION_TYPE } from './consts';
import styles from './create-collection.module.scss';
import { useCollectionTypes } from './hooks';

const COLLECTION_TYPE_SKELETONS = [null];

function CreateCollection() {
  // TODO: since we're fetching collectionTypes in metadata context, it's probably worth to reuse it
  const collectionTypes = useCollectionTypes();

  const renderCollectionTypes = () =>
    (collectionTypes || COLLECTION_TYPE_SKELETONS).map((item, index) =>
      item ? (
        <li key={item.type}>
          <CollectionType heading={item.type} text={item.description} {...COLLECTION_TYPE[item.type]} />
        </li>
      ) : (
        <li key={index}>
          <CollectionType.Skeleton />
        </li>
      ),
    );

  return (
    <Container maxWidth="sm">
      <h2 className={styles.heading}>Create Collection</h2>

      <p className={styles.text}>
        Choose your collection type: Simple NFT for pre-existing images, Composable NFT to generate layers and
        compositions, or NFT Collections for Music Creators to craft musical NFTs.
      </p>

      <ul>{renderCollectionTypes()}</ul>
    </Container>
  );
}

export { CreateCollection };
