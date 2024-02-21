import { useAccount } from '@gear-js/react-hooks';
import { generatePath } from 'react-router-dom';

import { ADDRESS, ROUTE } from '@/consts';
import { Wallet, Balance } from '@/features/wallet';

import { LinkButton } from '../../buttons';
import { Container } from '../container';
import { Logo } from '../logo';

import styles from './header.module.scss';

function Header() {
  const { account } = useAccount();

  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <div>
          <Logo />
          <LinkButton
            text="AI Collection"
            to={generatePath(ROUTE.COLLECTION, { id: ADDRESS.AI_COLLECTION })}
            className={styles.aiLink}
            size="small"
            color="dark"
          />
        </div>

        <div className={styles.wallet}>
          <Balance />

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
