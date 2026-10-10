import { describe, expect, it } from 'vitest';

import { buildCompanyMatchKeys } from 'src/logic-functions/utils/build-company-match-keys';

describe('buildCompanyMatchKeys', () => {
  it('extracts the employer identifiers from Explorium data', () => {
    const keys = buildCompanyMatchKeys({
      prospect_id: 'p1',
      company_website: 'acme.com',
      company_linkedin: 'https://linkedin.com/company/acme',
      company_name: ' Acme ',
    });

    expect(keys).toEqual({
      website: 'acme.com',
      linkedinUrl: 'linkedin.com/company/acme',
      name: 'Acme',
    });
  });

  it('omits identifiers Explorium did not return or that are blank', () => {
    expect(
      buildCompanyMatchKeys({
        prospect_id: 'p1',
        company_name: '   ',
        company_website: 'acme.com',
      }),
    ).toEqual({ website: 'acme.com' });
  });

  it('returns an empty object when no company identifiers are present', () => {
    expect(buildCompanyMatchKeys({ prospect_id: 'p1' })).toEqual({});
  });
});
