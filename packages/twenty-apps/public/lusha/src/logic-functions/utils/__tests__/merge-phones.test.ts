import { describe, expect, it } from 'vitest';

import { mergePhones } from 'src/logic-functions/utils/merge-phones';

const lushaPhone = (number: string, countryCode = '') => ({
  number,
  countryCode,
  callingCode: '',
});

describe('mergePhones', () => {
  it('should make the best Lusha phone primary when there is none', () => {
    expect(
      mergePhones({
        currentPhones: { primaryPhoneNumber: '', additionalPhones: [] },
        lushaPhones: [lushaPhone('+14155551234'), lushaPhone('+14155559876')],
      }),
    ).toEqual({
      primaryPhoneNumber: '+14155551234',
      primaryPhoneCountryCode: '',
      primaryPhoneCallingCode: '',
      additionalPhones: [lushaPhone('+14155559876')],
    });
  });

  it('should recognize a stored national number as the same phone', () => {
    expect(
      mergePhones({
        currentPhones: {
          primaryPhoneNumber: '4155551234',
          primaryPhoneCountryCode: 'US',
          primaryPhoneCallingCode: '+1',
          additionalPhones: null,
        },
        lushaPhones: [lushaPhone('+1 415-555-1234')],
      }),
    ).toBeUndefined();
  });

  it('should keep the current primary phone and add the new ones', () => {
    expect(
      mergePhones({
        currentPhones: {
          primaryPhoneNumber: '4155551234',
          primaryPhoneCountryCode: 'US',
          primaryPhoneCallingCode: '+1',
          additionalPhones: [
            { number: '4155550000', countryCode: 'US', callingCode: '+1' },
          ],
        },
        lushaPhones: [lushaPhone('+14155559876'), lushaPhone('+14155550000')],
      }),
    ).toEqual({
      primaryPhoneNumber: '4155551234',
      primaryPhoneCountryCode: 'US',
      primaryPhoneCallingCode: '+1',
      additionalPhones: [
        { number: '4155550000', countryCode: 'US', callingCode: '+1' },
        lushaPhone('+14155559876'),
      ],
    });
  });
});
