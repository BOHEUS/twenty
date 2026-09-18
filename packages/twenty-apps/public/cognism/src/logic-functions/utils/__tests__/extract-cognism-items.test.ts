import { describe, expect, it } from 'vitest';

import { extractCognismItems } from 'src/logic-functions/utils/extract-cognism-items';

describe('extractCognismItems', () => {
  it('returns a bare array unchanged', () => {
    expect(extractCognismItems([{ redeemId: 'r1' }])).toEqual([
      { redeemId: 'r1' },
    ]);
  });

  it.each(['results', 'data', 'contacts', 'accounts', 'records'])(
    'unwraps an array under %s',
    (key) => {
      expect(extractCognismItems({ [key]: [{ redeemId: 'r1' }] })).toEqual([
        { redeemId: 'r1' },
      ]);
    },
  );

  it('returns undefined when no array is present', () => {
    expect(extractCognismItems({ message: 'ok' })).toBeUndefined();
    expect(extractCognismItems('ok')).toBeUndefined();
    expect(extractCognismItems(null)).toBeUndefined();
  });
});
