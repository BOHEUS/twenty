import { describe, expect, it } from 'vitest';

import { buildCurrency } from 'src/logic-functions/data/build-currency';

describe('buildCurrency', () => {
  it('should convert an amount to micros in its currency', () => {
    expect(buildCurrency({ amount: 40000000, currencyCode: 'eur' })).toEqual({
      amountMicros: 40000000000000,
      currencyCode: 'EUR',
    });
  });

  it('should fall back to US dollars for a missing currency', () => {
    expect(buildCurrency({ amount: 1.5, currencyCode: undefined })).toEqual({
      amountMicros: 1500000,
      currencyCode: 'USD',
    });
  });

  it('should return nothing without an amount', () => {
    expect(
      buildCurrency({ amount: '205000000', currencyCode: 'USD' }),
    ).toBeUndefined();
  });
});
