import { describe, expect, it } from 'vitest';

import { buildFullName } from 'src/logic-functions/utils/build-full-name';

describe('buildFullName', () => {
  it('splits the single name string on the first space', () => {
    expect(buildFullName('ada lovelace')).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
    });
  });

  it('keeps every trailing token in the last name', () => {
    expect(buildFullName('jean claude van damme')).toEqual({
      firstName: 'Jean',
      lastName: 'Claude Van Damme',
    });
  });

  it('capitalizes hyphenated and apostrophed names', () => {
    expect(buildFullName("mary-jane o'brien")).toEqual({
      firstName: 'Mary-Jane',
      lastName: "O'Brien",
    });
  });

  it('leaves the last name empty for a mononym', () => {
    expect(buildFullName('prince')).toEqual({
      firstName: 'Prince',
      lastName: '',
    });
  });

  it('returns undefined when there is no name', () => {
    expect(buildFullName('   ')).toBeUndefined();
    expect(buildFullName(null)).toBeUndefined();
  });
});
