import {
  normalizeStoredPhone,
  normalizeStoredPhonesValue,
} from 'src/database/commands/upgrade-version-command/2-46/utils/normalize-stored-phones-value.util';

describe('normalizeStoredPhone', () => {
  it('leaves an already normalized phone unchanged', () => {
    const phone = { number: '612345678', callingCode: '+33', countryCode: 'FR' };

    expect(normalizeStoredPhone(phone)).toEqual(phone);
  });

  it('strips formatting and the trunk prefix', () => {
    expect(
      normalizeStoredPhone({
        number: '06 12 34 56 78',
        callingCode: '+33',
        countryCode: 'FR',
      }),
    ).toEqual({ number: '612345678', callingCode: '+33', countryCode: 'FR' });
  });

  it('adds the missing plus to a calling code', () => {
    expect(
      normalizeStoredPhone({
        number: '612345678',
        callingCode: '33',
        countryCode: null,
      }),
    ).toEqual({ number: '612345678', callingCode: '+33', countryCode: 'FR' });
  });

  it('derives the calling code from a number typed in international form', () => {
    expect(
      normalizeStoredPhone({
        number: '+1 (415) 555-2671',
        callingCode: '',
        countryCode: '',
      }),
    ).toEqual({ number: '4155552671', callingCode: '+1', countryCode: 'US' });
  });

  it('keeps a valid stored country code over the inferred one', () => {
    expect(
      normalizeStoredPhone({
        number: '4155552671',
        callingCode: '+1',
        countryCode: 'CA',
      }),
    ).toEqual({ number: '4155552671', callingCode: '+1', countryCode: 'CA' });
  });

  it('replaces a stored country that contradicts the resolved calling code', () => {
    expect(
      normalizeStoredPhone({
        number: '+44 20 7946 0958',
        callingCode: '',
        countryCode: 'FR',
      }),
    ).toEqual({ number: '2079460958', callingCode: '+44', countryCode: 'GB' });
  });

  it('leaves a phone it cannot place untouched', () => {
    const phone = { number: '0612345678', callingCode: '', countryCode: '' };

    expect(normalizeStoredPhone(phone)).toEqual(phone);
  });

  it('leaves an empty phone untouched', () => {
    const phone = { number: '', callingCode: '', countryCode: '' };

    expect(normalizeStoredPhone(phone)).toEqual(phone);
  });
});

describe('normalizeStoredPhonesValue', () => {
  it('reports no change for a normalized row', () => {
    const value = {
      primaryPhoneNumber: '612345678',
      primaryPhoneCallingCode: '+33',
      primaryPhoneCountryCode: 'FR',
      additionalPhones: [
        { number: '4155552671', callingCode: '+1', countryCode: 'US' },
      ],
    };

    expect(normalizeStoredPhonesValue(value)).toEqual({
      value,
      hasChanged: false,
    });
  });

  it('normalizes primary and additional phones and reports the change', () => {
    expect(
      normalizeStoredPhonesValue({
        primaryPhoneNumber: '06 12 34 56 78',
        primaryPhoneCallingCode: '+33',
        primaryPhoneCountryCode: 'FR',
        additionalPhones: [
          { number: '(415) 555-2671', callingCode: '1', countryCode: 'US' },
          { number: 'unknown', callingCode: '', countryCode: '' },
        ],
      }),
    ).toEqual({
      hasChanged: true,
      value: {
        primaryPhoneNumber: '612345678',
        primaryPhoneCallingCode: '+33',
        primaryPhoneCountryCode: 'FR',
        additionalPhones: [
          { number: '4155552671', callingCode: '+1', countryCode: 'US' },
          { number: 'unknown', callingCode: '', countryCode: '' },
        ],
      },
    });
  });

  it('keeps a null additional phones column as is', () => {
    const result = normalizeStoredPhonesValue({
      primaryPhoneNumber: '',
      primaryPhoneCallingCode: '',
      primaryPhoneCountryCode: '',
      additionalPhones: null,
    });

    expect(result.hasChanged).toBe(false);
    expect(result.value.additionalPhones).toBeNull();
  });
});
