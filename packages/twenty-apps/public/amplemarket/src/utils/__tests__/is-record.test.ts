import { describe, expect, it } from 'vitest';

import { isRecord } from 'src/utils/is-record';

describe('isRecord', () => {
  it('accepts plain objects', () => {
    expect(isRecord({ key: 'value' })).toBe(true);
  });

  it('rejects arrays, null and primitives', () => {
    expect(isRecord([])).toBe(false);
    expect(isRecord(null)).toBe(false);
    expect(isRecord('text')).toBe(false);
  });
});
