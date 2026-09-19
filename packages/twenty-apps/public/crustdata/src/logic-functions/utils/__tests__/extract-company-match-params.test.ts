import { describe, expect, it } from 'vitest';

import { extractCompanyMatchParams } from 'src/logic-functions/utils/extract-company-match-params';
import { type CompanyNode } from 'src/types/company-node';

const companyNode = (overrides: Partial<CompanyNode> = {}): CompanyNode => ({
  id: 'company-1',
  name: 'Analytical Engines',
  domainName: { primaryLinkUrl: 'https://www.analyticalengines.com/pricing' },
  linkedinLink: {
    primaryLinkUrl: 'https://www.linkedin.com/company/analytical-engines',
  },
  ...overrides,
});

describe('extractCompanyMatchParams', () => {
  it('prefers a known Crustdata id', () => {
    expect(
      extractCompanyMatchParams({
        node: companyNode({ crustdataCompanyId: '9911' }),
      }),
    ).toEqual({ identifierType: 'crustdata_company_ids', identifier: '9911' });
  });

  it('falls back to the bare domain', () => {
    expect(extractCompanyMatchParams({ node: companyNode() })).toEqual({
      identifierType: 'domains',
      identifier: 'analyticalengines.com',
    });
  });

  it('falls back to the LinkedIn URL', () => {
    expect(
      extractCompanyMatchParams({ node: companyNode({ domainName: null }) }),
    ).toEqual({
      identifierType: 'professional_network_profile_urls',
      identifier: 'https://www.linkedin.com/company/analytical-engines',
    });
  });

  it('falls back to the name last', () => {
    expect(
      extractCompanyMatchParams({
        node: companyNode({ domainName: null, linkedinLink: null }),
      }),
    ).toEqual({ identifierType: 'names', identifier: 'Analytical Engines' });
  });

  it('skips a company with no identifier at all', () => {
    expect(
      extractCompanyMatchParams({
        node: companyNode({ domainName: null, linkedinLink: null, name: null }),
      }),
    ).toBeUndefined();
  });
});
