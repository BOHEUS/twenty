import { isDefined } from 'twenty-sdk/utils';

import { buildCurrencyFromUsd } from 'src/logic-functions/utils/build-currency-from-usd';
import { toNumberLike } from 'src/logic-functions/utils/to-number-like';
import { type CurrencyValue } from 'src/types/currency-value';

const THOUSANDS = 1000;

// ZoomInfo reports company revenue in thousands of dollars: a $100M company
// comes back as 100000.
export const buildCurrencyFromThousandsUsd = (
  value: unknown,
): CurrencyValue | undefined => {
  const amountInThousands = toNumberLike(value);

  return isDefined(amountInThousands)
    ? buildCurrencyFromUsd(amountInThousands * THOUSANDS)
    : undefined;
};
