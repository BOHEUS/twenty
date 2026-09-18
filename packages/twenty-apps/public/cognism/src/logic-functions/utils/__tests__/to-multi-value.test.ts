import { describe, expect, it } from 'vitest';

import { toMultiValue } from 'src/logic-functions/utils/to-multi-value';

describe('toMultiValue', () => {
  it('passes an array through', () => {
    expect(toMultiValue(['Sales', 'Marketing'])).toEqual([
      'Sales',
      'Marketing',
    ]);
  });

  it('wraps a bare string', () => {
    expect(toMultiValue('Sales')).toEqual(['Sales']);
  });

  it('returns an empty array for anything else', () => {
    expect(toMultiValue(null)).toEqual([]);
    expect(toMultiValue({ value: 'Sales' })).toEqual([]);
  });
});
