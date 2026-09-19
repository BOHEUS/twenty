import { describe, expect, it } from 'vitest';

import { crustdataCompanyDataMock } from 'src/logic-functions/__mocks__/crustdata-company-data.mock';
import { mapCompany } from 'src/logic-functions/utils/map-company';

describe('mapCompany', () => {
  it('maps the standard Company fields', () => {
    const { standard } = mapCompany(crustdataCompanyDataMock);

    expect(standard.name).toBe('Analytical Engines');
    expect(standard.domainName).toMatchObject({
      primaryLinkUrl: 'analyticalengines.com',
    });
    expect(standard.linkedinLink).toMatchObject({
      primaryLinkUrl: 'https://www.linkedin.com/company/analytical-engines',
    });
  });

  it('keeps the headquarters line whole, since Crustdata gives no city or postcode', () => {
    const { standard } = mapCompany(crustdataCompanyDataMock);

    expect(standard.address).toMatchObject({
      addressStreet1: '1 Engine Way',
      addressState: 'England',
      addressCountry: 'United Kingdom',
      addressCity: '',
      addressPostcode: '',
    });
  });

  it('falls back to the headquarters line when there is no street address', () => {
    const { standard } = mapCompany({
      ...crustdataCompanyDataMock,
      locations: {
        ...crustdataCompanyDataMock.locations,
        street_address: undefined,
      },
    });

    expect(standard.address).toMatchObject({
      addressStreet1: '1 Engine Way, London EC1A 1AA',
    });
  });

  it('stores the revenue estimate as two bounds rather than one figure', () => {
    const { crustdata } = mapCompany(crustdataCompanyDataMock);

    expect(crustdata.crustdataRevenueLowerBound).toEqual({
      amountMicros: 25_000_000_000_000,
      currencyCode: 'USD',
    });
    expect(crustdata.crustdataRevenueUpperBound).toEqual({
      amountMicros: 50_000_000_000_000,
      currencyCode: 'USD',
    });
  });

  it('maps the custom fields from their documented paths', () => {
    const { crustdata } = mapCompany(crustdataCompanyDataMock);

    expect(crustdata).toMatchObject({
      crustdataCompanyId: '9911',
      crustdataLinkedinId: '4455',
      crustdataEmployeeCount: 312,
      crustdataEmployeeCountRange: '201-500',
      crustdataFoundedYear: 2019,
      crustdataIndustries: ['Software Development'],
      crustdataSpecialities: ['Compilers', 'Runtimes'],
      crustdataLastRoundType: 'Series B',
      crustdataLastFundraiseDate: '2025-11-03',
      crustdataTickers: ['AENG'],
      crustdataIpoDate: '2026-02-10',
      crustdataOpeningsCount: 24,
      crustdataEmployeeRating: 4.3,
      crustdataSoftwareRating: 4.6,
      crustdataFollowers: 48_000,
    });
  });

  it('falls back to the taxonomy industries when basic_info has none', () => {
    const { crustdata } = mapCompany({
      ...crustdataCompanyDataMock,
      basic_info: {
        ...crustdataCompanyDataMock.basic_info,
        industries: undefined,
      },
      taxonomy: {
        ...crustdataCompanyDataMock.taxonomy,
        professional_network_industries: ['Computer Software'],
      },
    });

    expect(crustdata.crustdataIndustries).toEqual(['Computer Software']);
  });

  it('reads the employee rating whether it is a number or an object', () => {
    const { crustdata } = mapCompany({
      ...crustdataCompanyDataMock,
      employee_reviews: { overall_rating: { rating: 3.9 } },
    });

    expect(crustdata.crustdataEmployeeRating).toBe(3.9);
  });

  it('returns no keys for an empty payload', () => {
    const { standard, crustdata } = mapCompany({});

    expect(standard).toEqual({});
    expect(crustdata).toEqual({});
  });
});
