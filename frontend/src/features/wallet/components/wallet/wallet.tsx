import { useAccount } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';

import { useModal } from '@/hooks';

import { AccountButton } from '../account-button';
import { WalletModal } from '../wallet-modal';

function Wallet() {
  const { account, isAccountReady } = useAccount();
  const [isModalOpen, openModal, closeModal] = useModal();

  return isAccountReady ? (
    <>
      {account ? (
        <AccountButton color="dark" address={account.address} name={account.meta.name} onClick={openModal} />
      ) : (
        <Button text="Connect Wallet" onClick={openModal} />
      )}

      {isModalOpen && <WalletModal close={closeModal} />}
    </>
  ) : null;
}

export { Wallet };
