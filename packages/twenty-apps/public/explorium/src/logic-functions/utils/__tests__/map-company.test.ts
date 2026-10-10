import { describe, expect, it } from 'vitest';

import { EXPLORIUM_COMPANY_DATA_MOCK } from 'src/logic-functions/__mocks__/explorium-company-data.mock';
import { mapCompany } from 'src/logic-functions/utils/map-company';

describe('mapCompany', () => {
  it('maps standard fields including the address composite', () => {
    const { standard } = mapCompany(EXPLORIUM_COMPANY_DATA_MOCK);

    expect(standard.name).toBe('Acme Corp');
    expect(standard.domainName).toMatchObject({ primaryLinkUrl: 'acme.com' });
    expect(standard.linkedinLink).toMatchObject({
      primaryLinkUrl: 'linkedin.com/company/acme',
    });
    expect(standard.address).toMatchObject({
      addressStreet1: '1 Market St',
      addressCity: 'san francisco',
      addressPostcode: '94105',
      addressState: 'california',
      addressCountry: 'united states',
    });
  });

  it('maps size and revenue ranges to their select values', () => {
    const { explorium } = mapCompany(EXPLORIUM_COMPANY_DATA_MOCK);

    expect(explorium.exploriumEmployeeRange).toBe('_201_500');
    expect(explorium.exploriumRevenueRange).toBe('_25M_75M');
  });

  it('drops a range outside the documented buckets', () => {
    const { explorium } = mapCompany({
      ...EXPLORIUM_COMPANY_DATA_MOCK,
      number_of_employees_range: '42',
    });

    expect(explorium.exploriumEmployeeRange).toBeUndefined();
  });

  it('maps text, industry codes and locations', () => {
    const { explorium } = mapCompany(EXPLORIUM_COMPANY_DATA_MOCK);

    expect(explorium).toMatchObject({
      exploriumId: '8adce3ca1cef0c986b22310e369a0793',
      exploriumDescription: 'Makes anvils.',
      exploriumIndustry: 'Manufacturing',
      exploriumTicker: 'NASDAQ:ACME',
      exploriumNaics: '332999',
      exploriumSic: '3499',
      exploriumSicDescription: 'Fabricated Metal Products',
      exploriumLocationsDistribution: [
        { country: 'united states', locations: 3 },
      ],
    });
  });
});
