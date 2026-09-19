import { describe, expect, it } from 'vitest';

import { splitE164Phone } from 'src/logic-functions/utils/split-e164-phone';

describe('splitE164Phone', () => {
  it('splits a French E.164 number', () => {
    expect(splitE164Phone('+33612345678')).toEqual({
      number: '612345678',
      callingCode: '+33',
    });
  });

  it('splits a US E.164 number', () => {
    expect(splitE164Phone('+14155552671')).toEqual({
      number: '4155552671',
      callingCode: '+1',
    });
  });

  it('prefers the longer calling code when two share a prefix', () => {
    expect(splitE164Phone('+12425551234')).toEqual({
      number: '5551234',
      callingCode: '+1242',
    });
  });

  it('keeps the digits when the number is not in E.164', () => {
    expect(splitE164Phone('(415) 555-2671')).toEqual({
      number: '4155552671',
      callingCode: '',
    });
  });

  it('returns undefined for a blank or non-string value', () => {
    expect(splitE164Phone('  ')).toBeUndefined();
    expect(splitE164Phone(null)).toBeUndefined();
    expect(splitE164Phone(42)).toBeUndefined();
  });
});
