import { describe, expect, it } from 'vitest';

import { buildTwentyPhones } from 'src/logic-functions/data/build-twenty-phones.util';

describe('buildTwentyPhones', () => {
  it('should split the calling code off the internationally formatted number', () => {
    const phones = buildTwentyPhones({
      most_probable_phone: { number: '+33 6 76 78 90 65', region: 'FR' },
    });

    expect(phones).toEqual({
      primaryPhoneNumber: '6 76 78 90 65',
      primaryPhoneCallingCode: '+33',
      primaryPhoneCountryCode: 'FR',
      additionalPhones: null,
    });
  });

  it('should drop numbers FullEnrich reported as inactive or misattributed', () => {
    const phones = buildTwentyPhones({
      most_probable_phone: { number: '+1 555-123-4567', region: 'US' },
      phones: [
        { number: '+1 555-123-4567', region: 'US', line_status: 'ACTIVE' },
        { number: '+1 555-000-0000', region: 'US', line_status: 'INACTIVE' },
        { number: '+1 555-111-1111', region: 'US', ownership_match: 'MISMATCH' },
        { number: '+33 1 42 86 82 82', region: 'FR', line_type: 'LANDLINE' },
      ],
    });

    expect(phones?.primaryPhoneNumber).toBe('555-123-4567');
    expect(phones?.additionalPhones).toEqual([
      { number: '1 42 86 82 82', callingCode: '+33', countryCode: 'FR' },
    ]);
  });

  it('should return undefined when no usable number came back', () => {
    expect(buildTwentyPhones({})).toBeUndefined();
    expect(
      buildTwentyPhones({
        most_probable_phone: null,
        phones: [{ number: '+1 555-000-0000', region: 'US', line_status: 'INACTIVE' }],
      }),
    ).toBeUndefined();
  });
});
