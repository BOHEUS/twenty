import { isNumber } from '@sniptt/guards';

import { type CurrencyValue } from 'src/logic-functions/types/currency-value';

export const buildCurrencyFromUsd = (
  amount: unknown,
): CurrencyValue | undefined => {
  if (!isNumber(amount) || !Number.isFinite(amount)) {
    return undefined;
  }

  return {
    amountMicros: Math.round(amount * 1_000_000),
    currencyCode: 'USD',
  };
};
