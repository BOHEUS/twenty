import { splitE164PhoneNumber } from '@/utils/phones/splitE164PhoneNumber';

describe('splitE164PhoneNumber', () => {
  it.each([
    ['+33612345678', { callingCode: '+33', nationalNumber: '612345678' }],
    ['+14155552671', { callingCode: '+1', nationalNumber: '4155552671' }],
    ['+442079460958', { callingCode: '+44', nationalNumber: '2079460958' }],
  ])(
    'splits %s the way the record transformer stores it',
    (input, expected) => {
      expect(splitE164PhoneNumber(input)).toEqual(expected);
    },
  );

  it('returns null for text that is not a phone number', () => {
    expect(splitE164PhoneNumber('anonymous')).toBeNull();
    expect(splitE164PhoneNumber('')).toBeNull();
  });
});
