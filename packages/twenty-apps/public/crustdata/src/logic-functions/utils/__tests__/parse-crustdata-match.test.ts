import { describe, expect, it } from 'vitest';

import {
  indexResultsByMatchedOn,
  parseCrustdataItem,
} from 'src/logic-functions/utils/parse-crustdata-match';

describe('parseCrustdataItem', () => {
  it('reads the highest-confidence match', () => {
    expect(
      parseCrustdataItem({
        item: {
          match_status: 'matched',
          matches: [
            { confidence_score: 0.98, person_data: { crustdata_person_id: 1 } },
          ],
        },
        httpStatus: 200,
        dataKey: 'person_data',
      }),
    ).toEqual({
      outcome: 'matched',
      httpStatus: 200,
      confidenceScore: 0.98,
      data: { crustdata_person_id: 1 },
    });
  });

  it('reports a redacted person apart from a no-match', () => {
    expect(
      parseCrustdataItem({
        item: { match_status: 'redacted', matches: [] },
        httpStatus: 200,
        dataKey: 'person_data',
      }),
    ).toEqual({ outcome: 'redacted', httpStatus: 200 });
  });

  it('reports an empty matches array as not found', () => {
    expect(
      parseCrustdataItem({
        item: { match_status: 'not_found', matches: [] },
        httpStatus: 200,
        dataKey: 'person_data',
      }),
    ).toEqual({ outcome: 'not_found', httpStatus: 200 });
  });

  it('reports a missing entry as an error', () => {
    expect(
      parseCrustdataItem({
        item: undefined,
        httpStatus: 200,
        dataKey: 'company_data',
      }),
    ).toMatchObject({ outcome: 'error' });
  });
});

describe('indexResultsByMatchedOn', () => {
  it('indexes results case-insensitively on the echoed identifier', () => {
    const index = indexResultsByMatchedOn([
      { matched_on: 'https://www.linkedin.com/in/AdaLovelace', matches: [] },
    ]);

    expect(
      index.get('https://www.linkedin.com/in/adalovelace'),
    ).toBeDefined();
  });

  it('returns an empty index for a non-array body', () => {
    expect(indexResultsByMatchedOn({ error: 'nope' }).size).toBe(0);
  });

  it('indexes a numeric matched_on, as returned for crustdata_company_ids', () => {
    const index = indexResultsByMatchedOn([
      { matched_on: 9911, matches: [] },
    ]);

    expect(index.get('9911')).toBeDefined();
  });
});
