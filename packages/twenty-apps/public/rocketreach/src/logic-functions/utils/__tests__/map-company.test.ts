import { describe, expect, it } from 'vitest';

import { rocketReachCompanyDataMock } from 'src/logic-functions/__mocks__/rocketreach-company-data.mock';
import { mapCompany } from 'src/logic-functions/utils/map-company';

describe('mapCompany', () => {
  it('normalizes the domain and reads LinkedIn out of links', () => {
    const { standard } = mapCompany(rocketReachCompanyDataMock);

    expect(standard.domainName).toMatchObject({
      primaryLinkUrl: 'analytical-engines.com',
    });
    expect(standard.linkedinLink).toMatchObject({
      primaryLinkUrl: 'https://www.linkedin.com/company/analytical-engines',
    });
  });

  it('converts revenue into a currency value', () => {
    const { standard } = mapCompany(rocketReachCompanyDataMock);

    expect(standard.annualRevenue).toEqual({
      amountMicros: 2_500_000_000_000,
      currencyCode: 'USD',
    });
  });

  it('builds the address from the address object', () => {
    const { standard } = mapCompany(rocketReachCompanyDataMock);

    expect(standard.address).toMatchObject({
      addressStreet1: '1 Difference Way',
      addressCity: 'London',
      addressState: 'England',
      addressPostcode: 'EC1A 1AA',
      addressCountry: 'United Kingdom',
    });
  });

  it('stringifies the numeric industry codes', () => {
    const { rocketReach } = mapCompany(rocketReachCompanyDataMock);

    expect(rocketReach.rocketReachSicCodes).toEqual(['3571']);
    expect(rocketReach.rocketReachNaicsCodes).toEqual(['334111']);
  });

  it('turns the company phone into a phones value', () => {
    const { rocketReach } = mapCompany(rocketReachCompanyDataMock);

    expect(rocketReach.rocketReachPhone).toMatchObject({
      primaryPhoneNumber: '+442079460000',
    });
  });
});
