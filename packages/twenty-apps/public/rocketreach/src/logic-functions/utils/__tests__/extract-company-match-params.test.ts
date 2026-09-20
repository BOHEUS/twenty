import { describe, expect, it } from 'vitest';

import { extractCompanyMatchParams } from 'src/logic-functions/utils/extract-company-match-params';

describe('extractCompanyMatchParams', () => {
  it('reuses a stored company id', () => {
    expect(
      extractCompanyMatchParams({
        node: { id: 'record-1', rocketReachId: '987', name: 'Anything' },
      }),
    ).toEqual({ companyId: 987 });
  });

  it('normalizes the domain it looks up by', () => {
    expect(
      extractCompanyMatchParams({
        node: {
          id: 'record-1',
          domainName: { primaryLinkUrl: 'https://www.Analytical-Engines.com/x' },
        },
      }),
    ).toEqual({ domain: 'analytical-engines.com' });
  });

  it('skips a record with no usable identifier', () => {
    expect(
      extractCompanyMatchParams({ node: { id: 'record-1' } }),
    ).toBeUndefined();
  });
});
