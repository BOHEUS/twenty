import { describe, expect, it } from 'vitest';

import { toNumber } from 'src/logic-functions/utils/to-number';

describe('toNumber', () => {
  it('passes finite numbers through', () => {
    expect(toNumber(1843)).toBe(1843);
  });

  it('parses numeric strings, as RocketReach sends birth_year', () => {
    expect(toNumber('1815')).toBe(1815);
  });

  it('rejects values that are not numbers', () => {
    expect(toNumber('unknown')).toBeUndefined();
    expect(toNumber('')).toBeUndefined();
    expect(toNumber(Number.POSITIVE_INFINITY)).toBeUndefined();
    expect(toNumber(null)).toBeUndefined();
  });
});
