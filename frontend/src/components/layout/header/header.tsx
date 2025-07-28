import { useAccount, useDeriveBalancesAll } from '@gear-js/react-hooks';
import { Wallet } from '@gear-js/wallet-connect';

import { ROUTE } from '@/consts';
import { NFTSearch } from '@/features/nft-search';

import { LinkButton } from '../../buttons';
import { Container } from '../container';
import { Logo } from '../logo';

import { Balance } from '../balance';
import styles from './header.module.scss';

function Header() {
  const { account } = useAccount();
  const { data: balance } = useDeriveBalancesAll({ address: account?.address });

  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <div className={styles.search}>
          <Logo />
          <NFTSearch />
        </div>

        <div className={styles.wallet}>
          {balance && <Balance value={
            (balance.transferable || balance.availableBalance)?.toBigInt()
          } />}

          <div className={styles.buttons}>
            {account && <LinkButton to={ROUTE.CREATE_COLLECTION} text="Create" />}

            <Wallet displayBalance={false} />
          </div>
        </div>
      </Container>
    </header>
  );
}

export { Header };
