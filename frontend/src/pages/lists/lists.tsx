import { Outlet, useLocation } from 'react-router-dom';

import { Container } from '@/components';
import { GridSize, useGridSize } from '@/features/lists';
import { cx } from '@/utils';

import { Tabs } from './components';
import styles from './lists.module.scss';

function Lists() {
  const { pathname } = useLocation();
  const [, listName] = pathname.split('/');

  const { gridSize, setGridSize } = useGridSize();

  return (
    <Container>
      <header className={styles.header}>
        <Tabs />
        <GridSize value={gridSize} onChange={setGridSize} />
      </header>

      <ul className={cx(styles.list, styles[gridSize], styles[listName])}>
        <Outlet />
      </ul>
    </Container>
  );
}

export { Lists };
