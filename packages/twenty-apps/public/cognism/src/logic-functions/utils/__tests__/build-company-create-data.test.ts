import { describe, expect, it } from 'vitest';

import { buildCompanyCreateData } from 'src/logic-functions/utils/build-company-create-data';

describe('buildCompanyCreateData', () => {
  it('maps the match keys onto Company standard and cognism fields', () => {
    const data = buildCompanyCreateData({
      cognismId: 'cognism-account-1',
      name: 'Acme',
      website: 'acme.com',
      linkedinUrl: 'linkedin.com/company/acme',
    });

    expect(data).toMatchObject({
      name: 'Acme',
      cognismId: 'cognism-account-1',
    });
    expect(data.domainName).toMatchObject({ primaryLinkUrl: 'acme.com' });
    expect(data.linkedinLink).toMatchObject({
      primaryLinkUrl: 'linkedin.com/company/acme',
    });
  });

  it('omits fields Cognism did not return', () => {
    expect(buildCompanyCreateData({ name: 'Acme' })).toEqual({ name: 'Acme' });
  });
});
