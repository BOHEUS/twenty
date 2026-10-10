import { describe, expect, it } from 'vitest';

import { toFoundedYear } from 'src/logic-functions/utils/to-founded-year';

describe('toFoundedYear', () => {
  it('reads a year as a number or a four-digit string', () => {
    expect(toFoundedYear(2004)).toBe(2004);
    expect(toFoundedYear(' 2004 ')).toBe(2004);
  });

  it('ignores anything else', () => {
    expect(toFoundedYear('around 2004')).toBeUndefined();
    expect(toFoundedYear(null)).toBeUndefined();
  });
});
