import { describe, expect, it } from 'vitest';

import { COGNISM_COMPANY_DATA_MOCK } from 'src/logic-functions/__mocks__/cognism-company-data.mock';
import { mapCompany } from 'src/logic-functions/utils/map-company';

describe('mapCompany', () => {
  it('maps standard fields', () => {
    const { standard } = mapCompany(COGNISM_COMPANY_DATA_MOCK);

    expect(standard.name).toBe('Acme');
    expect(standard.domainName).toMatchObject({ primaryLinkUrl: 'acme.com' });
    expect(standard.linkedinLink).toMatchObject({
      primaryLinkUrl: 'linkedin.com/company/acme',
    });
    expect(standard.annualRevenue).toEqual({
      amountMicros: 12_500_000_000_000,
      currencyCode: 'USD',
    });
  });

  it('builds the address from the headquarters location', () => {
    const { standard } = mapCompany(COGNISM_COMPANY_DATA_MOCK);

    expect(standard.address).toMatchObject({
      addressStreet1: '10 Main Street',
      addressCity: 'London',
      addressState: 'Greater London',
      addressPostcode: 'EC1A 1BB',
      addressCountry: 'United Kingdom',
    });
  });

  it('falls back to the first location when none is flagged as headquarters', () => {
    const { standard } = mapCompany({
      ...COGNISM_COMPANY_DATA_MOCK,
      locations: [{ city: 'Manchester', country: 'United Kingdom' }],
    });

    expect(standard.address).toMatchObject({ addressCity: 'Manchester' });
  });

  it('maps identifiers, selects and counts', () => {
    const { cognism } = mapCompany(COGNISM_COMPANY_DATA_MOCK);

    expect(cognism.cognismId).toBe('cognism-account-1');
    expect(cognism.cognismRedeemId).toBe('redeem-account-1');
    expect(cognism.cognismCompanyType).toBe('PRIVATE');
    expect(cognism.cognismSizeRange).toBe('SIZE_201_500');
    expect(cognism.cognismHeadcount).toBe(412);
    expect(cognism.cognismFoundedYear).toBe(1998);
  });

  it('dedupes array fields and passes classification codes through as raw json', () => {
    const { cognism } = mapCompany(COGNISM_COMPANY_DATA_MOCK);

    expect(cognism.cognismIndustries).toEqual([
      'Software',
      'Information Technology',
    ]);
    expect(cognism.cognismTechnologies).toEqual(['Salesforce', 'Snowflake']);
    expect(cognism.cognismNaics).toEqual([{ code: '541511' }]);
    expect(cognism.cognismSic).toEqual([{ code: '7372' }]);
  });

  it('maps office phones and the confirmation date', () => {
    const { cognism } = mapCompany(COGNISM_COMPANY_DATA_MOCK);

    expect(cognism.cognismOfficePhones).toMatchObject({
      primaryPhoneNumber: '+442071234567',
    });
    expect(cognism.cognismLastConfirmed).toBe('2026-09-01T00:00:00.000Z');
  });
});
