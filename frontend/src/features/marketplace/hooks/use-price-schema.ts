import { useApi, useBalanceFormat } from '@gear-js/react-hooks';
import { ZodEffects, ZodTypeAny, z } from 'zod';

type GetPriceSchemaReturn = ZodEffects<ZodTypeAny, string, string>;

type GetPriceSchema = {
  (minValue: string, isExclusive?: boolean): GetPriceSchemaReturn;
  (): GetPriceSchemaReturn;
};

function usePriceSchema() {
  const { api } = useApi();

  const { getChainBalanceValue, getFormattedBalanceValue } = useBalanceFormat();

  const getPriceSchema: GetPriceSchema = (_minValue?: string, isExclusive?: boolean) => {
    if (!api) throw new Error('API is not initialized');

    const decimals = api.registry.chainDecimals.toString();
    const existentialDeposit = api.existentialDeposit.toString();

    const minValue = _minValue || existentialDeposit;
    const formattedMinValue = getFormattedBalanceValue(minValue).toFixed();

    const minValueMessage = isExclusive
      ? `Value should be bigger than ${formattedMinValue}`
      : `Minimum value is ${formattedMinValue}`;

    const integerMessage = `Maximum amount of decimal places is ${decimals}`;

    return z
      .string()
      .transform((value) => getChainBalanceValue(value))
      .refine((value) => (isExclusive ? value.gt(minValue) : value.gte(minValue)), minValueMessage)
      .refine((value) => value.isInteger(), integerMessage)
      .transform((value) => value.toFixed());
  };

  return { getPriceSchema };
}

export { usePriceSchema };
