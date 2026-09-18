import { describe, expect, it } from 'vitest';

import { toDate } from 'src/logic-functions/utils/to-date';

describe('toDate', () => {
  it('expands a date-only value to an ISO timestamp', () => {
    expect(toDate('2026-08-14')).toBe('2026-08-14T00:00:00.000Z');
  });

  it('passes an ISO timestamp through', () => {
    expect(toDate('2026-08-14T09:30:00.000Z')).toBe('2026-08-14T09:30:00.000Z');
  });

  it('returns undefined for unparseable, empty or non-string values', () => {
    expect(toDate('not a date')).toBeUndefined();
    expect(toDate('  ')).toBeUndefined();
    expect(toDate(20260814)).toBeUndefined();
    expect(toDate(null)).toBeUndefined();
  });
});
