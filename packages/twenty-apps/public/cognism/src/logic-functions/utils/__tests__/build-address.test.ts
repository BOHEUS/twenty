import { describe, expect, it } from 'vitest';

import { buildAddress } from 'src/logic-functions/utils/build-address';

describe('buildAddress', () => {
  it('maps parts to the address composite using addressPostcode', () => {
    expect(
      buildAddress({
        city: 'San Francisco',
        state: 'California',
        postcode: '94107',
        country: 'United States',
      }),
    ).toEqual({
      addressStreet1: '',
      addressStreet2: '',
      addressCity: 'San Francisco',
      addressPostcode: '94107',
      addressState: 'California',
      addressCountry: 'United States',
      addressLat: null,
      addressLng: null,
    });
  });

  it('returns undefined when no part has a value', () => {
    expect(buildAddress({ city: '', country: null })).toBeUndefined();
  });
});
