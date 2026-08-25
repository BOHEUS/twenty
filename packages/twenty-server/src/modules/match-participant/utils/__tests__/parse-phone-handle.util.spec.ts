import { parsePhoneHandle } from 'src/modules/match-participant/utils/parse-phone-handle.util';

describe('parsePhoneHandle', () => {
  it('splits an E.164 handle into calling code and national number', () => {
    expect(parsePhoneHandle('+33780123456')).toEqual({
      callingCode: '+33',
      nationalNumber: '780123456',
      countryCode: 'FR',
    });
  });

  it('accepts a handle without the leading plus, as WhatsApp sends it', () => {
    expect(parsePhoneHandle('33780123456')).toEqual(
      parsePhoneHandle('+33780123456'),
    );
  });

  it('ignores surrounding whitespace', () => {
    expect(parsePhoneHandle('  +33780123456 ')).toEqual(
      parsePhoneHandle('+33780123456'),
    );
  });

  it('leaves the country undefined when the calling code spans several', () => {
    expect(parsePhoneHandle('+12125550123')).toMatchObject({
      callingCode: '+1',
      nationalNumber: '2125550123',
    });
  });

  it('returns undefined for a handle that is not a phone number', () => {
    expect(parsePhoneHandle('contact@example.com')).toBeUndefined();
    expect(parsePhoneHandle('not-a-number')).toBeUndefined();
    expect(parsePhoneHandle('')).toBeUndefined();
    expect(parsePhoneHandle('   ')).toBeUndefined();
  });
});
