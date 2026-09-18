import { describe, expect, it } from 'vitest';

import { buildSizeRange } from 'src/logic-functions/utils/build-size-range';

describe('buildSizeRange', () => {
  it.each([
    [1, 10, 'SIZE_1_10'],
    [11, 50, 'SIZE_11_50'],
    [51, 200, 'SIZE_51_200'],
    [201, 500, 'SIZE_201_500'],
    [501, 1000, 'SIZE_501_1000'],
    [1001, 5000, 'SIZE_1001_5000'],
    [5001, 10000, 'SIZE_5001_10000'],
    [10001, null, 'SIZE_10001_PLUS'],
    [250000, null, 'SIZE_10001_PLUS'],
  ])('buckets %s-%s as %s', (sizeFrom, sizeTo, expected) => {
    expect(buildSizeRange({ sizeFrom, sizeTo })).toBe(expected);
  });

  it('falls back to the upper bound when no lower bound is returned', () => {
    expect(buildSizeRange({ sizeFrom: null, sizeTo: 50 })).toBe('SIZE_11_50');
  });

  it('returns undefined for missing or negative sizes', () => {
    expect(buildSizeRange({ sizeFrom: null, sizeTo: null })).toBeUndefined();
    expect(buildSizeRange({ sizeFrom: 'many', sizeTo: null })).toBeUndefined();
    expect(buildSizeRange({ sizeFrom: -5, sizeTo: null })).toBeUndefined();
  });
});
