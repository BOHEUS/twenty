import { normalizePhoneNumberToE164 } from '@/utils/phones/normalizePhoneNumberToE164';

describe('normalizePhoneNumberToE164', () => {
  describe('international input', () => {
    it.each([
      ['+33612345678', '+33612345678'],
      ['+33 6 12 34 56 78', '+33612345678'],
      ['+1 (415) 555-2671', '+14155552671'],
      ['  +44 20 7946 0958  ', '+442079460958'],
    ])('normalizes %p to %p', (number, expected) => {
      expect(normalizePhoneNumberToE164({ number })).toBe(expected);
    });

    it('drops the national trunk prefix left after a calling code', () => {
      expect(normalizePhoneNumberToE164({ number: '+33 0612345678' })).toBe(
        '+33612345678',
      );
    });

    it('drops an extension', () => {
      expect(
        normalizePhoneNumberToE164({ number: '+1 415 555 2671 ext. 123' }),
      ).toBe('+14155552671');
    });

    it('ignores calling and country codes when the number is already international', () => {
      expect(
        normalizePhoneNumberToE164({
          number: '+33612345678',
          callingCode: '+1',
          countryCode: 'US',
        }),
      ).toBe('+33612345678');
    });
  });

  describe('stored phones composite shape', () => {
    it('combines a calling code with a national number', () => {
      expect(
        normalizePhoneNumberToE164({
          number: '612345678',
          callingCode: '+33',
          countryCode: 'FR',
        }),
      ).toBe('+33612345678');
    });

    it('accepts a calling code stored without the plus', () => {
      expect(
        normalizePhoneNumberToE164({ number: '612345678', callingCode: '33' }),
      ).toBe('+33612345678');
    });

    it('drops the national trunk prefix when a calling code is given', () => {
      expect(
        normalizePhoneNumberToE164({
          number: '0612345678',
          callingCode: '+33',
        }),
      ).toBe('+33612345678');
    });

    it('falls back to the country code when the calling code is empty', () => {
      expect(
        normalizePhoneNumberToE164({
          number: '06 12 34 56 78',
          callingCode: '',
          countryCode: 'FR',
        }),
      ).toBe('+33612345678');
    });

    it('prefers the calling code over a contradicting country code', () => {
      expect(
        normalizePhoneNumberToE164({
          number: '4155552671',
          callingCode: '+1',
          countryCode: 'FR',
        }),
      ).toBe('+14155552671');
    });
  });

  describe('default country', () => {
    it('uses the default country when nothing else is known', () => {
      expect(
        normalizePhoneNumberToE164({
          number: '4155552671',
          defaultCountryCode: 'US',
        }),
      ).toBe('+14155552671');
    });

    it('prefers the stored country code over the default country', () => {
      expect(
        normalizePhoneNumberToE164({
          number: '0612345678',
          countryCode: 'FR',
          defaultCountryCode: 'US',
        }),
      ).toBe('+33612345678');
    });

    it('ignores an unknown default country', () => {
      expect(
        normalizePhoneNumberToE164({
          number: '4155552671',
          defaultCountryCode: 'ZZ',
        }),
      ).toBeNull();
    });
  });

  describe('whatsapp identifiers', () => {
    it('normalizes a wa_id once the caller prefixes the plus', () => {
      expect(normalizePhoneNumberToE164({ number: '+33612345678' })).toBe(
        '+33612345678',
      );
    });

    it('cannot place bare international digits without a plus or a country', () => {
      expect(normalizePhoneNumberToE164({ number: '33612345678' })).toBeNull();
    });
  });

  describe('range assignment', () => {
    it('normalizes a well-formed number in an unassigned range', () => {
      expect(
        normalizePhoneNumberToE164({
          number: '5551234567',
          callingCode: '+1',
          countryCode: 'US',
        }),
      ).toBe('+15551234567');
    });

    it('normalizes a stored number consistently even with a doubtful calling code', () => {
      expect(
        normalizePhoneNumberToE164({ number: '0612345678', callingCode: '+1' }),
      ).toBe('+10612345678');
    });
  });

  describe('unparseable input', () => {
    it.each([
      [{ number: null }],
      [{ number: undefined }],
      [{ number: '' }],
      [{ number: '   ' }],
      [{ number: 'anonymous' }],
      [{ number: '4155552671' }],
      [{ number: '+999 123' }],
      [{ number: '+1 555' }],
      [{ number: '12345', countryCode: 'US' }],
      [{ number: '612345678', countryCode: 'XX' }],
    ])('returns null for %p', (input) => {
      expect(normalizePhoneNumberToE164(input)).toBeNull();
    });
  });
});
