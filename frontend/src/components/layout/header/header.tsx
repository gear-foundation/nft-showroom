import { Container } from '../container';
import { Logo } from '../logo';

import styles from './header.module.scss';

function Header() {
  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <Logo />

        <a
          className={styles.link}
          href="https://github.com/gear-foundation/nft-showroom"
          target="_blank"
          rel="noreferrer">
          GitHub
        </a>
      </Container>
    </header>
  );
}

export { Header };
