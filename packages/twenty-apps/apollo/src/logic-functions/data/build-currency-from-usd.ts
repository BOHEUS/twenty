import { isDefined } from './is-defined';
import { toNumber } from './to-number';

const MICROS_PER_UNIT = 1_000_000;

export const buildCurrencyFromUsd = (
  amount: unknown,
): { amountMicros: number; currencyCode: string } | undefined => {
  const dollars = toNumber(amount);

  if (!isDefined(dollars)) {
    return undefined;
  }

  return {
    amountMicros: Math.round(dollars * MICROS_PER_UNIT),
    currencyCode: 'USD',
  };
};
