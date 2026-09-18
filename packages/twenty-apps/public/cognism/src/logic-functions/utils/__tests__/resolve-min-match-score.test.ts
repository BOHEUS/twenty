import { describe, expect, it } from 'vitest';

import { resolveMinMatchScore } from 'src/logic-functions/utils/resolve-min-match-score';

const RANGE_ERROR = 'Minimum match score must be an integer between 0 and 100.';

describe('resolveMinMatchScore', () => {
  it('returns a score inside the Cognism range', () => {
    expect(resolveMinMatchScore(0)).toBe(0);
    expect(resolveMinMatchScore(80)).toBe(80);
    expect(resolveMinMatchScore(100)).toBe(100);
  });

  it('returns undefined when no score was requested', () => {
    expect(resolveMinMatchScore()).toBeUndefined();
    expect(resolveMinMatchScore(undefined)).toBeUndefined();
  });

  it('throws for a score outside the range or one that is not an integer', () => {
    expect(() => resolveMinMatchScore(-1)).toThrow(RANGE_ERROR);
    expect(() => resolveMinMatchScore(101)).toThrow(RANGE_ERROR);
    expect(() => resolveMinMatchScore(80.5)).toThrow(RANGE_ERROR);
    expect(() => resolveMinMatchScore(Number.NaN)).toThrow(RANGE_ERROR);
  });
});
