import { useAccountDeriveBalancesAll } from '@gear-js/react-hooks';

import { Balance } from '@/components';

function AccountBalance() {
  const balances = useAccountDeriveBalancesAll();

  return balances ? <Balance value={balances.freeBalance} /> : null;
}

export { AccountBalance };
