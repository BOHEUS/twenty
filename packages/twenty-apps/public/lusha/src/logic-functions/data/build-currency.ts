import { type CurrencyField } from 'twenty-sdk/define';
import { isDefined } from 'twenty-sdk/utils';

import { toNumber } from 'src/logic-functions/data/to-number';
import { toText } from 'src/logic-functions/data/to-text';

const CURRENCY_CODE_REGEX = /^[A-Z]{3}$/;

export const buildCurrency = ({
  amount,
  currencyCode,
}: {
  amount: unknown;
  currencyCode: unknown;
}): CurrencyField | undefined => {
  const numericAmount = toNumber(amount);

  if (!isDefined(numericAmount)) {
    return undefined;
  }

  const upperCaseCurrencyCode = toText(currencyCode)?.toUpperCase();

  return {
    amountMicros: Math.round(numericAmount * 1_000_000),
    // Lusha reports funding in US dollars unless it says otherwise.
    currencyCode:
      isDefined(upperCaseCurrencyCode) &&
      CURRENCY_CODE_REGEX.test(upperCaseCurrencyCode)
        ? upperCaseCurrencyCode
        : 'USD',
  };
};
