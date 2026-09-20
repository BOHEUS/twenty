import { describe, expect, it } from 'vitest';

import { parseCompanyLookupResponse } from 'src/logic-functions/utils/parse-company-lookup-response';

describe('parseCompanyLookupResponse', () => {
  it('matches a company profile', () => {
    expect(
      parseCompanyLookupResponse({
        json: { id: 1, name: 'Analytical Engines Ltd' },
        httpStatus: 200,
      }),
    ).toEqual({
      outcome: 'matched',
      httpStatus: 200,
      data: { id: 1, name: 'Analytical Engines Ltd' },
    });
  });

  it('treats an empty body as no match', () => {
    expect(
      parseCompanyLookupResponse({ json: {}, httpStatus: 200 }),
    ).toEqual({ outcome: 'not_found', httpStatus: 200 });
  });

  it('maps 404 to not found', () => {
    expect(
      parseCompanyLookupResponse({ json: null, httpStatus: 404 }).outcome,
    ).toBe('not_found');
  });

  it('reports an error for a failed request', () => {
    expect(
      parseCompanyLookupResponse({
        json: { message: 'Forbidden' },
        httpStatus: 403,
      }),
    ).toEqual({ outcome: 'error', httpStatus: 403, message: 'Forbidden' });
  });
});
