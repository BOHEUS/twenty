import { describe, expect, it } from 'vitest';

import { parseCognismMatch } from 'src/logic-functions/utils/parse-cognism-match';

describe('parseCognismMatch', () => {
  it('reads the redeem id and match score', () => {
    expect(parseCognismMatch({ redeemId: 'r1', matchScore: 92 })).toEqual({
      redeemId: 'r1',
      matchScore: 92,
    });
  });

  it('accepts a snake_case redeem id', () => {
    expect(parseCognismMatch({ redeem_id: 'r1' })).toEqual({
      redeemId: 'r1',
      matchScore: null,
    });
  });

  it('returns undefined without a redeem id', () => {
    expect(parseCognismMatch({ matchScore: 92 })).toBeUndefined();
    expect(parseCognismMatch({ redeemId: '  ' })).toBeUndefined();
    expect(parseCognismMatch(null)).toBeUndefined();
  });
});
