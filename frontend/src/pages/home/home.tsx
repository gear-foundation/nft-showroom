import { useState } from 'react';

import { Container, Tabs } from '@/components';
import { Collections } from '@/features/collections';

import styles from './home.module.scss';

const TABS = ['Collections', 'NFTs'];

function Home() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Container>
      <Tabs list={TABS} className={styles.tabs} value={tabIndex} onChange={setTabIndex} />

      {tabIndex === 0 && <Collections />}
      {/* {tabIndex === 1 && <NFTs} */}
    </Container>
  );
}

export { Home };
