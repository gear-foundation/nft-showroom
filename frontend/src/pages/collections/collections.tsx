import { useState } from 'react';

import { Container, Tabs } from '@/components';
import { Collections as CollectionsFeature } from '@/features/collections';

import styles from './collections.module.scss';

const TABS = ['Collections', 'NFTs'];

function Collections() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Container>
      <Tabs list={TABS} className={styles.tabs} value={tabIndex} onChange={setTabIndex} />

      {tabIndex === 0 && <CollectionsFeature />}
      {/* {tabIndex === 1 && <NFTs} */}
    </Container>
  );
}

export { Collections };
