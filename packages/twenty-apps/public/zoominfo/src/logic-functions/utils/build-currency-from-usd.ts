import { isDefined } from 'twenty-sdk/utils';

import { toNumberLike } from 'src/logic-functions/utils/to-number-like';
import { type CurrencyValue } from 'src/types/currency-value';

const MICROS = 1_000_000;

export const buildCurrencyFromUsd = (
  value: unknown,
): CurrencyValue | undefined => {
  const amount = toNumberLike(value);

  if (!isDefined(amount)) {
    return undefined;
  }

  return { amountMicros: Math.round(amount * MICROS), currencyCode: 'USD' };
};
