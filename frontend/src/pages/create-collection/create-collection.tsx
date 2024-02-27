import { Container } from '@/components';
import { useMarketplace } from '@/context';
import { CreateCollection as CollectionType } from '@/features/create-simple-collection';

import { COLLECTION_TYPE } from './consts';
import styles from './create-collection.module.scss';

const COLLECTION_TYPE_SKELETONS = [null];

function CreateCollection() {
  const { marketplace } = useMarketplace();
  const { collectionTypes } = marketplace || {};

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
