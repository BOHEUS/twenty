import { describe, expect, it } from 'vitest';

import { buildCompanyCreateData } from 'src/logic-functions/utils/build-company-create-data';

describe('buildCompanyCreateData', () => {
  it('maps the employer fields onto Company standard fields', () => {
    const data = buildCompanyCreateData({
      company: 'Acme',
      website: 'https://www.acme.com',
      company_linkedin: 'https://linkedin.com/company/acme',
    });

    expect(data.name).toBe('Acme');
    expect(data.domainName).toMatchObject({ primaryLinkUrl: 'acme.com' });
    expect(data.linkedinLink).toMatchObject({
      primaryLinkUrl: 'linkedin.com/company/acme',
    });
  });

  it('omits fields Dropcontact did not return', () => {
    expect(buildCompanyCreateData({ company: 'Acme' })).toEqual({
      name: 'Acme',
    });
  });
});
