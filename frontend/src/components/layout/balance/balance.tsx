import { useApi, useBalanceFormat } from '@gear-js/react-hooks';
import { Balance as BalanceType } from '@polkadot/types/interfaces';

import VaraSVG from '@/assets/vara.svg?react';

import styles from './balance.module.scss';

type Props = {
  value: BalanceType | bigint;
};

// TODO: group with AccountBalance in a common folder
function Balance({ value }: Props) {
  const { isApiReady } = useApi();

  const { getFormattedBalance } = useBalanceFormat();
  const balance = isApiReady ? getFormattedBalance(value) : null;

  return (
    <span className={styles.balance}>
      <VaraSVG />

      {balance && (
        <span className={styles.text}>
          <span className={styles.value}>{balance.value}</span>
          <span className={styles.unit}>{balance.unit}</span>
        </span>
      )}
    </span>
  );
}

export { Balance };
