import { describe, expect, it } from 'vitest';

import { buildCurrencyFromUsd } from 'src/logic-functions/utils/build-currency-from-usd';

describe('buildCurrencyFromUsd', () => {
  it('converts dollars to micros', () => {
    expect(buildCurrencyFromUsd(2_500_000)).toEqual({
      amountMicros: 2_500_000_000_000,
      currencyCode: 'USD',
    });
  });

  it('returns undefined for missing or non-positive revenue', () => {
    expect(buildCurrencyFromUsd(null)).toBeUndefined();
    expect(buildCurrencyFromUsd(0)).toBeUndefined();
    expect(buildCurrencyFromUsd(-5)).toBeUndefined();
  });
});
