import { describe, expect, it } from 'vitest';

import { buildPhones } from 'src/logic-functions/utils/build-phones';

describe('buildPhones', () => {
  it('promotes the recommended phone to primary', () => {
    expect(
      buildPhones([
        { e164: '+15550000', country_code: 'US' },
        { e164: '+15551111', country_code: 'US', recommended: true },
      ]),
    ).toEqual({
      primaryPhoneNumber: '+15551111',
      primaryPhoneCountryCode: 'US',
      primaryPhoneCallingCode: '',
      additionalPhones: [
        { number: '+15550000', countryCode: 'US', callingCode: '' },
      ],
    });
  });

  it('falls back to the display number when e164 is missing', () => {
    expect(buildPhones([{ number: '020 7946 0000' }])).toEqual({
      primaryPhoneNumber: '020 7946 0000',
      primaryPhoneCountryCode: '',
      primaryPhoneCallingCode: '',
      additionalPhones: null,
    });
  });

  it('uppercases the country code and drops invalid ones', () => {
    expect(buildPhones([{ e164: '+442079460000', country_code: 'gb' }])
      ?.primaryPhoneCountryCode).toBe('GB');
    expect(
      buildPhones([{ e164: '+442079460000', country_code: 'United Kingdom' }])
        ?.primaryPhoneCountryCode,
    ).toBe('');
  });

  it('dedupes repeated numbers', () => {
    expect(
      buildPhones([{ e164: '+15550000' }, { e164: '+15550000' }])
        ?.additionalPhones,
    ).toBeNull();
  });

  it('returns undefined when the payload has no phones', () => {
    expect(buildPhones(undefined)).toBeUndefined();
    expect(buildPhones([{ number: null, e164: null }])).toBeUndefined();
  });
});
