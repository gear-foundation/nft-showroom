import { Link, useLocation, useMatch } from 'react-router-dom';

import { Container } from '@/components';
import { ROUTE } from '@/consts';
import { CollectionCard, NFTCard, Skeleton } from '@/features/collections';
import CollectionCardSkeletonSVG from '@/features/collections/assets/collection-card-skeleton.svg?react';
import NFTCardSkeletonSVG from '@/features/collections/assets/nft-card-skeleton.svg?react';
import { GridSize, useGridSize } from '@/features/lists';
import { cx } from '@/utils';

import { useCollections, useNFTs } from './hooks';
import styles from './lists.module.scss';

const TABS = [
  { to: ROUTE.HOME, text: 'Collections' },
  { to: ROUTE.NFTS, text: 'NFTs' },
];

const COLLECTION_SKELETONS = new Array(6).fill(null);
const NFT_SKELETONS = new Array(8).fill(null);

function Lists() {
  const { pathname } = useLocation();
  const match = useMatch(ROUTE.NFTS);

  const { gridSize, setGridSize } = useGridSize();

  const collections = useCollections();
  const nfts = useNFTs();

  const renderTabs = () =>
    TABS.map(({ to, text }, index) => {
      const counter = [collections?.length, nfts?.length][index];

      return (
        <li key={to}>
          <Link to={to} className={cx(styles.tab, to === pathname && styles.active)}>
            {text} {counter !== undefined && `(${counter})`}
          </Link>
        </li>
      );
    });

  const renderCollections = () =>
    collections
      ? collections.map((collection) => <CollectionCard key={collection.id} {...collection} />)
      : COLLECTION_SKELETONS.map((_collection, index) => (
          <li key={index}>
            <Skeleton key={index}>
              <CollectionCardSkeletonSVG key={index} />
            </Skeleton>
          </li>
        ));

  const renderNFTs = () =>
    nfts
      ? nfts.map(({ id, ...nft }) => <NFTCard key={id} {...nft} />)
      : NFT_SKELETONS.map((_nft, index) => (
          <li key={index}>
            <Skeleton>
              <NFTCardSkeletonSVG />
            </Skeleton>
          </li>
        ));

  return (
    <Container>
      <header className={styles.header}>
        <ul className={styles.tabs}>{renderTabs()}</ul>
        <GridSize value={gridSize} onChange={setGridSize} />
      </header>

      <ul className={cx(styles.list, styles[gridSize], match && styles.nfts)}>
        {(match ? renderNFTs : renderCollections)()}
      </ul>
    </Container>
  );
}

export { Lists };
