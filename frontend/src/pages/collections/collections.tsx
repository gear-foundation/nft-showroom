import { useState } from 'react';

import { Container, Tabs } from '@/components';
import { CollectionCard } from '@/features/collections';
import { useCollectionIds } from '@/features/marketplace';

import styles from './collections.module.scss';

const TABS = ['Collections', 'NFTs'];

function Collections() {
  const [tabIndex, setTabIndex] = useState(0);

  const collectionIds = useCollectionIds();

  const renderCollections = () =>
    collectionIds?.map(([id]) => {
      return <CollectionCard key={id} id={id} />;
    });

  return (
    <Container>
      <Tabs list={TABS} className={styles.tabs} value={tabIndex} onChange={setTabIndex} />

      <ul className={styles.list}>{tabIndex === 0 && renderCollections()}</ul>
    </Container>
  );
}

export { Collections };
