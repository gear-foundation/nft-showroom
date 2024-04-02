import { Link, useLocation, useMatch } from 'react-router-dom';

import { Container, List } from '@/components';
import { ROUTE } from '@/consts';
import { CollectionCard, NFTCard, Skeleton } from '@/features/collections';
import CollectionCardSkeletonSVG from '@/features/collections/assets/collection-card-skeleton.svg?react';
import NFTCardSkeletonSVG from '@/features/collections/assets/nft-card-skeleton.svg?react';
import { AccountFilter, GridSize, useAccountFilter, useGridSize } from '@/features/lists';
import { GRID_SIZE } from '@/features/lists/consts';
import { cx } from '@/utils';

import { useCollections, useNFTs } from './hooks';
import styles from './lists.module.scss';

const TABS = [
  { to: ROUTE.HOME, text: 'Collections' },
  { to: ROUTE.NFTS, text: 'NFTs' },
];

function Lists() {
  const { pathname } = useLocation();
  const match = useMatch(ROUTE.NFTS);

  const { gridSize, setGridSize } = useGridSize();
  const { accountFilterValue, accountFilterAddress, setAccountFilterValue } = useAccountFilter();

  const [collections, collectionsCount, hasMoreCollections, isCollectionsQueryReady, fetchCollections] =
    useCollections(accountFilterAddress);
  const [nfts, nftsCount, hasMoreNFTs, isNFTsQueryReady, fetchNFTs] = useNFTs(accountFilterAddress);

  const renderTabs = () =>
    TABS.map(({ to, text }, index) => {
      const counter = [collectionsCount, nftsCount][index];

      return (
        <li key={to}>
          <Link to={to} className={cx(styles.tab, to === pathname && styles.active)}>
            {text} {counter !== undefined && `(${counter})`}
          </Link>
        </li>
      );
    });

  return (
    <Container>
      <header className={styles.header}>
        <ul className={styles.tabs}>{renderTabs()}</ul>

        <div className={styles.options}>
          <AccountFilter value={accountFilterValue} onChange={setAccountFilterValue} />
          <GridSize value={gridSize} onChange={setGridSize} />
        </div>
      </header>

      {match ? (
        <List
          items={nfts}
          itemsPerRow={gridSize === GRID_SIZE.SMALL ? 4 : 3}
          emptyText="Mint NFTs"
          // TODO: should be fixed with cursor pagination,
          // however cuz of indexer's limitations we have to deal with duplicates,
          // and therefore adding index to the key
          renderItem={(nft, index) => <NFTCard key={`${nft.id}-${index}`} {...nft} />}
          fetchItems={fetchNFTs}
          isMoreItems={hasMoreNFTs}
          skeleton={{
            rowsCount: 2,
            isVisible: !isNFTsQueryReady,
            renderItem: (index) => (
              <li key={index}>
                <Skeleton>
                  <NFTCardSkeletonSVG />
                </Skeleton>
              </li>
            ),
          }}
        />
      ) : (
        <List
          items={collections}
          itemsPerRow={gridSize === GRID_SIZE.SMALL ? 3 : 2}
          emptyText="Create collections"
          // adding index in the key, same as above
          renderItem={(collection, index) => <CollectionCard key={`${collection.id}-${index}`} {...collection} />}
          fetchItems={fetchCollections}
          isMoreItems={hasMoreCollections}
          skeleton={{
            rowsCount: 2,
            isVisible: !isCollectionsQueryReady,
            renderItem: (index) => (
              <li key={index}>
                <Skeleton>
                  <CollectionCardSkeletonSVG />
                </Skeleton>
              </li>
            ),
          }}
        />
      )}
    </Container>
  );
}

export { Lists };
