import { describe, expect, it } from 'vitest';

import { toBoolean } from 'src/logic-functions/utils/to-boolean';

describe('toBoolean', () => {
  it('passes booleans through', () => {
    expect(toBoolean(true)).toBe(true);
    expect(toBoolean(false)).toBe(false);
  });

  it('returns undefined for anything else', () => {
    expect(toBoolean('true')).toBeUndefined();
    expect(toBoolean(1)).toBeUndefined();
    expect(toBoolean(null)).toBeUndefined();
  });
});
