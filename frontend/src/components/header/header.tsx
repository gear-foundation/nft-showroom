import { Wallet } from '@/features';

import { Container } from '../container';
import { Logo } from '../logo';
import styles from './header.module.scss';

function Header() {
  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <Logo />
        <Wallet />
      </Container>
    </header>
  );
}

export { Header };
