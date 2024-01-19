import { useApi, useBalanceFormat } from '@gear-js/react-hooks';
import { z } from 'zod';

import { isDecimal } from './utils';

function useGetPriceSchema() {
  const { api } = useApi();
  const { getChainBalanceValue, getFormattedBalanceValue } = useBalanceFormat();

  const getPriceSchema = () => {
    if (!api) throw new Error('API is not initialized');

    const decimals = api.registry.chainDecimals.toString();
    const existentialDeposit = api.existentialDeposit.toString();

    const isGraterThanEDepositMessage = `Minimum value is ${getFormattedBalanceValue(existentialDeposit).toFixed()}`;
    const isChainValueDecimalMessage = `Maximum amount of decimal places is ${decimals}`;

    return z
      .string()
      .transform((value) => getChainBalanceValue(value))
      .refine((value) => value.isGreaterThanOrEqualTo(existentialDeposit), isGraterThanEDepositMessage)
      .transform((value) => value.toFixed())
      .refine((value) => !isDecimal(value), isChainValueDecimalMessage);
  };

  return { getPriceSchema };
}

export { useGetPriceSchema };
