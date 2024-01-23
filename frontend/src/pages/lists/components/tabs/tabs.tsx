import { Link, useLocation } from 'react-router-dom';

import { ROUTE } from '@/consts';
import { useCollectionIds } from '@/features/marketplace';
import { cx } from '@/utils';

import { useNFTs } from '../../hooks';

import styles from './tabs.module.scss';

const TABS = [
  { to: ROUTE.HOME, text: 'Collections' },
  { to: ROUTE.NFTS, text: 'NFTs' },
];

function Tabs() {
  const { pathname } = useLocation();

  const collectionIds = useCollectionIds();
  const nfts = useNFTs();

  const counters = [collectionIds?.length || 0, nfts?.length || 0];

  const renderTabs = () =>
    TABS.map(({ to, text }, index) => {
      const isActive = to === pathname;
      const counter = counters[index];

      return (
        <li key={to}>
          <Link to={to} className={cx(styles.tab, isActive && styles.active)}>
            {text} ({counter})
          </Link>
        </li>
      );
    });

  return <ul className={cx(styles.tabs)}>{renderTabs()}</ul>;
}

export { Tabs };
