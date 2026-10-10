import { describe, expect, it } from 'vitest';

import { buildCompanyMatchKeys } from 'src/logic-functions/utils/build-company-match-keys';

describe('buildCompanyMatchKeys', () => {
  it('extracts the employer identifiers from Dropcontact data', () => {
    const keys = buildCompanyMatchKeys({
      website: 'acme.com',
      company_linkedin: 'https://linkedin.com/company/acme',
      company: ' Acme ',
    });

    expect(keys).toEqual({
      website: 'acme.com',
      linkedinUrl: 'linkedin.com/company/acme',
      name: 'Acme',
    });
  });

  it('omits identifiers Dropcontact did not return or that are blank', () => {
    expect(
      buildCompanyMatchKeys({
        company: '   ',
        website: 'acme.com',
      }),
    ).toEqual({ website: 'acme.com' });
  });

  it('returns an empty object when no company identifiers are present', () => {
    expect(buildCompanyMatchKeys({})).toEqual({});
  });
});
