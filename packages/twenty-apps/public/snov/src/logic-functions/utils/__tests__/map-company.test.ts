import { describe, expect, it } from 'vitest';

import { SNOV_COMPANY_DATA_MOCK } from 'src/logic-functions/__mocks__/snov-company-data.mock';
import { mapCompany } from 'src/logic-functions/utils/map-company';

describe('mapCompany', () => {
  it('maps the domain search company data', () => {
    const { standard, snov } = mapCompany(SNOV_COMPANY_DATA_MOCK);

    expect(standard).toMatchObject({
      name: 'Acme Corp',
      domainName: { primaryLinkUrl: 'acme.com' },
      address: { addressCity: 'Austin' },
    });
    expect(snov).toMatchObject({
      snovIndustry: 'Manufacturing',
      snovSize: '51-200',
      snovFoundedYear: 2004,
      snovPhone: { primaryPhoneNumber: '+1 512 555 0100' },
      snovRelatedDomains: ['acme.co', 'acme.io'],
    });
  });
});
