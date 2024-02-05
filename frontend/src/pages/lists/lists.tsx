import { Link, useLocation, useMatch } from 'react-router-dom';

import { Container } from '@/components';
import { ROUTE } from '@/consts';
import { CollectionCard, NFTCard } from '@/features/collections';
import { GridSize, useGridSize } from '@/features/lists';
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

  const collections = useCollections();
  const nfts = useNFTs();
  console.log('nfts: ', nfts);

  const counters = [collections?.length || 0, nfts?.length || 0];

  const renderTabs = () =>
    TABS.map(({ to, text }, index) => (
      <li key={to}>
        <Link to={to} className={cx(styles.tab, to === pathname && styles.active)}>
          {text} ({counters[index]})
        </Link>
      </li>
    ));

  const renderCollections = () =>
    collections?.map((collection) => <CollectionCard key={collection.id} {...collection} />);

  const renderNFTs = () => nfts?.map(({ id, ...nft }) => <NFTCard key={id} {...nft} />);

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
