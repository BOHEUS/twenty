import { describe, expect, it } from 'vitest';

import { toNumericValue } from 'src/logic-functions/utils/to-numeric-value';

describe('toNumericValue', () => {
  it('parses numeric strings with spaces and decimal commas', () => {
    expect(toNumericValue('12 345')).toBe(12345);
    expect(toNumericValue('1,5')).toBe(1.5);
    expect(toNumericValue(42)).toBe(42);
  });

  it('returns undefined for anything else', () => {
    expect(toNumericValue('')).toBeUndefined();
    expect(toNumericValue('n/a')).toBeUndefined();
    expect(toNumericValue(null)).toBeUndefined();
  });
});
