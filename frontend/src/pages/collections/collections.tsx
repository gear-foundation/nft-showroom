import { useState } from 'react';

import { Container, Tabs } from '@/components';
import { CollectionCard, NFTCard } from '@/features/collections';
import { useCollectionIds } from '@/features/marketplace';

import styles from './collections.module.scss';
import { useNFTs } from './hooks';

const TABS = ['Collections', 'NFTs'];

function CollectionsList() {
  const collectionIds = useCollectionIds();

  return collectionIds?.map(([id]) => {
    return <CollectionCard key={id} id={id} />;
  });
}

function NFTsList() {
  const nfts = useNFTs();

  return nfts?.map(({ nft, collection }) => (
    <NFTCard key={`${nft.id}-${collection.id}`} nft={nft} collection={collection} />
  ));
}

function Collections() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Container>
      <Tabs list={TABS} className={styles.tabs} value={tabIndex} onChange={setTabIndex} />

      <ul className={styles.list}>
        {tabIndex === 0 && <CollectionsList />}
        {tabIndex === 1 && <NFTsList />}
      </ul>
    </Container>
  );
}

export { Collections };
