import { describe, expect, it } from 'vitest';

import { AMPLEMARKET_COMPANY_DATA_MOCK } from 'src/logic-functions/__mocks__/amplemarket-company-data.mock';
import { mapCompany } from 'src/logic-functions/utils/map-company';

describe('mapCompany', () => {
  it('uses the primary location for the address, without a street', () => {
    expect(mapCompany(AMPLEMARKET_COMPANY_DATA_MOCK).standard).toMatchObject({
      name: 'Acme Corp',
      domainName: { primaryLinkUrl: 'acme.com' },
      linkedinLink: { primaryLinkUrl: 'linkedin.com/company/acme' },
      address: {
        addressStreet1: '',
        addressCity: 'Austin',
        addressPostcode: '78701',
        addressState: 'Texas',
      },
    });
  });

  it('maps the Amplemarket company fields', () => {
    expect(mapCompany(AMPLEMARKET_COMPANY_DATA_MOCK).amplemarket).toMatchObject(
      {
        amplemarketIndustry: 'Manufacturing',
        amplemarketSize: '51-200 employees',
        amplemarketEmployeeCount: 120,
        amplemarketIsB2b: true,
        amplemarketIsB2c: false,
        amplemarketSicCodes: ['3499'],
        amplemarketNaicsCodes: ['332999'],
        amplemarketEstimatedRevenue: '$10M-$100M',
        amplemarketRevenue: 25000000,
        amplemarketTotalFunding: 12000000,
        amplemarketLatestFundingStage: 'series_a',
        amplemarketLatestFundingDate: '2024-05-01',
        amplemarketTechnologies: ['Salesforce'],
      },
    );
  });
});
