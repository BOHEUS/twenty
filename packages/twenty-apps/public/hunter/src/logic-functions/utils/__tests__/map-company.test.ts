import { describe, expect, it } from 'vitest';

import { HUNTER_COMPANY_DATA_MOCK } from 'src/logic-functions/__mocks__/hunter-company-data.mock';
import { mapCompany } from 'src/logic-functions/utils/map-company';

describe('mapCompany', () => {
  it('maps standard fields, including the exact revenue in micros', () => {
    expect(mapCompany(HUNTER_COMPANY_DATA_MOCK).standard).toMatchObject({
      name: 'Acme Corp',
      domainName: { primaryLinkUrl: 'acme.com' },
      linkedinLink: { primaryLinkUrl: 'linkedin.com/company/acme' },
      address: {
        addressStreet1: '1 Main St',
        addressCity: 'Austin',
        addressPostcode: '78701',
        addressCountry: 'United States',
      },
      annualRevenue: { amountMicros: 25_000_000_000_000, currencyCode: 'USD' },
    });
  });

  it('maps Hunter fields and builds social links from handles', () => {
    expect(mapCompany(HUNTER_COMPANY_DATA_MOCK).hunter).toMatchObject({
      hunterLegalName: 'Acme Corporation',
      hunterIndustry: 'Manufacturing',
      hunterSicCode: '3499',
      hunterEmployeeRange: '51-250',
      hunterEmployeeCount: 120,
      hunterEstimatedRevenue: '$10M-$50M',
      hunterTotalFunding: {
        amountMicros: 12_000_000_000_000,
        currencyCode: 'USD',
      },
      hunterFoundedYear: 2004,
      hunterTech: ['google_analytics'],
      hunterXLink: { primaryLinkUrl: 'https://x.com/acme' },
      hunterCrunchbaseLink: {
        primaryLinkUrl: 'https://www.crunchbase.com/organization/acme',
      },
      hunterParentDomain: 'acme-holdings.com',
    });
  });
});
