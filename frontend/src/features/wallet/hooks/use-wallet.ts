import { useAccount, useBalanceFormat } from '@gear-js/react-hooks';
import { useState } from 'react';
import { WALLET } from '../consts';
import { WalletId } from '../types';

function useWallet() {
  const { account, accounts } = useAccount();
  const [walletId, setWalletId] = useState(account?.meta.source as WalletId | undefined);

  const { getChainGasValue } = useBalanceFormat();
  const test = getChainGasValue(123);

  const resetWalletId = () => setWalletId(undefined);
  const getWalletAccounts = (id: WalletId) => accounts?.filter(({ meta }) => meta.source === id);

  const wallet = walletId && WALLET[walletId];
  const walletAccounts = walletId && getWalletAccounts(walletId);

  return { wallet, walletAccounts, setWalletId, resetWalletId, getWalletAccounts };
}

export { useWallet };
