import { useAccount } from '@gear-js/react-hooks';

import { ROUTE } from '@/consts';
import { Wallet, AccountBalance } from '@/features/wallet';

import { LinkButton } from '../../buttons';
import { Container } from '../container';
import { Logo } from '../logo';

import styles from './header.module.scss';

function Header() {
  const { account } = useAccount();

  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <Logo />

        <div className={styles.wallet}>
          <AccountBalance />

          <div className={styles.buttons}>
            {account && <LinkButton to={ROUTE.CREATE_COLLECTION} text="Create" />}

            <Wallet />
          </div>
        </div>
      </Container>
    </header>
  );
}

export { Header };
