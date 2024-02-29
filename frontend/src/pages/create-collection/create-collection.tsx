import { Container, Skeleton } from '@/components';
import { useMarketplace } from '@/context';
import { CreateCollection as CollectionType } from '@/features/create-simple-collection';

import { COLLECTION_TYPE } from './consts';
import styles from './create-collection.module.scss';
import { useCreateCountdown } from './hooks';
import { getTimer } from './utils';

const COLLECTION_TYPE_SKELETONS = [null];

function CreateCollection() {
  const { marketplace } = useMarketplace();
  const { collectionTypes } = marketplace || {};

  const msTillCreateIsAvailable = useCreateCountdown();
  const isCreateAvailable = msTillCreateIsAvailable === 0;
  const isReady = Boolean(collectionTypes) && msTillCreateIsAvailable !== undefined;

  const renderCollectionTypes = () =>
    collectionTypes?.map((item) => (
      <li key={item.type}>
        <CollectionType heading={item.type} text={item.description} {...COLLECTION_TYPE[item.type]} />
      </li>
    ));

  const renderSkeletons = () =>
    COLLECTION_TYPE_SKELETONS.map((_item, index) => (
      <li key={index}>
        <CollectionType.Skeleton />
      </li>
    ));

  return (
    <Container maxWidth="sm" className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Create Collection</h2>

        {isReady && isCreateAvailable && (
          <p className={styles.text}>
            Choose your collection type: Simple NFT for pre-existing images, Composable NFT to generate layers and
            compositions, or NFT Collections for Music Creators to craft musical NFTs.
          </p>
        )}

        {isReady && !isCreateAvailable && (
          <>
            <p className={styles.text}>
              You&apos;ve recently created a collection. Please wait a little bit before creating another one.
            </p>
            <p className={styles.text}>{getTimer(msTillCreateIsAvailable)}</p>
          </>
        )}

        {!isReady && <Skeleton width="100%" height="5rem" borderRadius="15px" />}
      </header>

      {isReady && isCreateAvailable && <ul>{renderCollectionTypes()}</ul>}
      {!isReady && <ul>{renderSkeletons()}</ul>}
    </Container>
  );
}

export { CreateCollection };
