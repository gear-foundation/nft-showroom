import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Container } from '@/components';
import { cx } from '@/utils';

import { GridButtons, Tabs } from './components';
import styles from './lists.module.scss';

function Lists() {
  const { pathname } = useLocation();
  const [, listName] = pathname.split('/');

  const [gridSize, setGridSize] = useState<'large' | 'small'>('small');

  return (
    <Container>
      <header className={styles.header}>
        <Tabs />
        <GridButtons value={gridSize} onChange={setGridSize} />
      </header>

      <ul className={cx(styles.list, styles[gridSize], styles[listName])}>
        <Outlet />
      </ul>
    </Container>
  );
}

export { Lists };
