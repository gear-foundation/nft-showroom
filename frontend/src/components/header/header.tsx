import { Link } from 'react-router-dom';

import { ROUTE } from '@/consts';
import { Wallet } from '@/features';

import LogoSVG from './logo.svg?react';
import styles from './header.module.scss';
import { Container } from '../container';

function Header() {
  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <Link to={ROUTE.HOME}>
          <LogoSVG />
        </Link>

        <Wallet />
      </Container>
    </header>
  );
}

export { Header };
