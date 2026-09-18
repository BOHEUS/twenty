import { describe, expect, it } from 'vitest';

import { pickHeadquarters } from 'src/logic-functions/utils/pick-headquarters';

describe('pickHeadquarters', () => {
  it('prefers the location flagged as headquarters', () => {
    expect(
      pickHeadquarters([
        { city: 'Manchester' },
        { city: 'London', headquarters: true },
      ]),
    ).toEqual({ city: 'London', headquarters: true });
  });

  it('falls back to the first location when none is flagged', () => {
    expect(
      pickHeadquarters([{ city: 'Manchester' }, { city: 'London' }]),
    ).toEqual({ city: 'Manchester' });
  });

  it('returns undefined for an empty or non-array value', () => {
    expect(pickHeadquarters([])).toBeUndefined();
    expect(pickHeadquarters(null)).toBeUndefined();
    expect(pickHeadquarters('London')).toBeUndefined();
  });
});
