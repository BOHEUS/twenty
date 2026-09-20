import { toNumber } from 'src/logic-functions/utils/to-number';
import { type CurrencyValue } from 'src/types/currency-value';
import { isDefined } from 'src/logic-functions/utils/is-defined';

const MICROS_PER_UNIT = 1_000_000;

// RocketReach reports revenue as a plain USD figure.
export const buildCurrencyFromUsd = (
  rawAmount: unknown,
): CurrencyValue | undefined => {
  const amount = toNumber(rawAmount);

  if (!isDefined(amount) || amount <= 0) {
    return undefined;
  }

  return {
    amountMicros: Math.round(amount * MICROS_PER_UNIT),
    currencyCode: 'USD',
  };
};
