import { describe, expect, it } from 'vitest';

import { formatRevenueRange } from 'src/logic-functions/data/format-revenue-range';

describe('formatRevenueRange', () => {
  it('should format revenue bounds in compact dollars', () => {
    expect(formatRevenueRange({ min: 10000000, max: 50000000 })).toBe(
      '$10M-$50M',
    );
    expect(formatRevenueRange({ min: 1500000, max: 100000000000 })).toBe(
      '$1.5M-$100B',
    );
  });

  it('should format a range open on one side', () => {
    expect(formatRevenueRange({ min: 1000000000 })).toBe('$1B+');
    expect(formatRevenueRange({ max: 1000000 })).toBe('Up to $1M');
  });

  it('should return nothing without bounds', () => {
    expect(formatRevenueRange({ exact: 364 })).toBeUndefined();
    expect(formatRevenueRange(undefined)).toBeUndefined();
  });
});
