import { useCollectionIds } from '@/hooks';

import { CollectionCard } from '../collection-card';

import styles from './collections.module.scss';

function Collections() {
  const collectionIds = useCollectionIds();

  const getCollections = () =>
    collectionIds?.map(([id]) => {
      return <CollectionCard key={id} id={id} />;
    });

  return <ul className={styles.list}>{getCollections()}</ul>;
}

export { Collections };
