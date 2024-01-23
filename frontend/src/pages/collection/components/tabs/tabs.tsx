import { ROUTE } from '@/consts';
import { useCollectionIds } from '@/features/marketplace';
import { cx } from '@/utils';

const TABS = [
  { to: ROUTE.HOME, text: 'Collections' },
  { to: ROUTE.NFTS, text: 'NFTs' },
];

type Tab = {
  text: string;
  value: string;
};

type Props = {
  list: Tab[];
};

function Tabs() {
  // const renderTabs = () =>
  //   TABS.map(({ to, text }, index) => {
  //     const isActive = to === pathname;
  //     const counter = counters[index];

  //     return (
  //       <li key={to}>
  //         <Link to={to} className={cx(styles.tab, isActive && styles.active)}>
  //           {text}
  //         </Link>
  //       </li>
  //     );
  //   });

  const renderTabs = () => null;

  return <ul>{renderTabs()}</ul>;
}

export { Tabs };
