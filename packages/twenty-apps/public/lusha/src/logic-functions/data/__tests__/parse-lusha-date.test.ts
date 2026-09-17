import { describe, expect, it } from 'vitest';

import { parseLushaDate } from 'src/logic-functions/data/parse-lusha-date';

describe('parseLushaDate', () => {
  it('should read both date formats Lusha returns', () => {
    expect(parseLushaDate('2026-04-23')).toBe('2026-04-23');
    expect(parseLushaDate('2026-04-23T08:30:00.000Z')).toBe('2026-04-23');
    expect(parseLushaDate('Nov 10, 2021')).toBe('2021-11-10');
    expect(parseLushaDate('February 3, 2020')).toBe('2020-02-03');
  });

  it('should reject dates that do not exist', () => {
    expect(parseLushaDate('2026-02-30')).toBeUndefined();
    expect(parseLushaDate('Foo 10, 2021')).toBeUndefined();
    expect(parseLushaDate('yesterday')).toBeUndefined();
  });
});
