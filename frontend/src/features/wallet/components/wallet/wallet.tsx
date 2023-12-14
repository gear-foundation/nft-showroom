import { Button } from '@gear-js/vara-ui';
import { useAccount, useApi, useBalance, useBalanceFormat } from '@gear-js/react-hooks';
import { useState } from 'react';

import VaraSVG from '../../assets/vara.svg?react';
import { AccountButton } from '../account-button';
import { WalletModal } from '../wallet-modal';
import styles from './wallet.module.css';

function Wallet() {
  const { isApiReady } = useApi();
  const { account, isAccountReady } = useAccount();

  const { getFormattedBalance } = useBalanceFormat();
  const { balance } = useBalance(account?.address);
  const formattedBalance = isApiReady && balance && getFormattedBalance(balance);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return isAccountReady ? (
    <>
      <div className={styles.wallet}>
        {formattedBalance && (
          <div className={styles.balance}>
            <VaraSVG />

            <p className={styles.text}>
              <span className={styles.value}>{formattedBalance.value}</span>
              <span className={styles.unit}>{formattedBalance.unit}</span>
            </p>
          </div>
        )}

        {account ? (
          <AccountButton address={account.address} name={account.meta.name} onClick={openModal} />
        ) : (
          <Button text="Connect Wallet" onClick={openModal} />
        )}
      </div>

      {isModalOpen && <WalletModal close={closeModal} />}
    </>
  ) : null;
}

export { Wallet };
