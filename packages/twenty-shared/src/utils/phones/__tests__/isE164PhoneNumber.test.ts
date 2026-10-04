import { isE164PhoneNumber } from '@/utils/phones/isE164PhoneNumber';

describe('isE164PhoneNumber', () => {
  it.each(['+33612345678', '+14155552671', '+12', '+123456789012345'])(
    'accepts %s',
    (value) => {
      expect(isE164PhoneNumber(value)).toBe(true);
    },
  );

  it.each([
    '',
    '+',
    '+1',
    '33612345678',
    '+0612345678',
    '+33 6 12 34 56 78',
    '+33612345678x12',
    '+1234567890123456',
    'tel:+33612345678',
  ])('rejects %p', (value) => {
    expect(isE164PhoneNumber(value)).toBe(false);
  });
});
