import { describe, expect, it } from 'vitest';

import { LUSHA_COMPANY_MOCK } from 'src/logic-functions/__mocks__/lusha-company.mock';
import {
  buildCompanyLushaData,
  buildCompanyStandardData,
} from 'src/logic-functions/utils/build-company-update-data';

describe('buildCompanyStandardData', () => {
  it('should fill an empty company from Lusha', () => {
    expect(
      buildCompanyStandardData({
        company: { id: 'company-1' },
        lushaCompany: LUSHA_COMPANY_MOCK,
      }),
    ).toEqual({
      name: 'Lusha',
      linkedinLink: {
        primaryLinkUrl: 'https://www.linkedin.com/company/lushadata',
        primaryLinkLabel: '',
        secondaryLinks: null,
      },
      address: {
        addressStreet1: '',
        addressStreet2: '',
        addressCity: 'Boston',
        addressState: 'Massachusetts',
        addressPostcode: '02199',
        addressCountry: 'United States',
        addressLat: null,
        addressLng: null,
      },
    });
  });

  it('should leave the values a company already has', () => {
    expect(
      buildCompanyStandardData({
        company: {
          id: 'company-1',
          name: 'Lusha Systems',
          address: { addressStreet1: '800 Boylston Street' },
        },
        lushaCompany: LUSHA_COMPANY_MOCK,
      }),
    ).toEqual({
      linkedinLink: {
        primaryLinkUrl: 'https://www.linkedin.com/company/lushadata',
        primaryLinkLabel: '',
        secondaryLinks: null,
      },
    });
  });
});

describe('buildCompanyLushaData', () => {
  it('should map the Lusha company onto the Lusha fields', () => {
    expect(
      buildCompanyLushaData({
        lushaCompany: LUSHA_COMPANY_MOCK,
        enrichedAt: '2026-09-17T10:00:00.000Z',
      }),
    ).toEqual({
      lushaId: '16303253',
      lushaDescription: 'Lusha is the leader in Sales Streaming.',
      lushaIndustry: 'Technology, Information & Media',
      lushaSubIndustry: 'Software Development',
      lushaEmployeeCount: 364,
      lushaRevenueRange: '$10M-$50M',
      lushaFoundedYear: 2016,
      lushaCompanyType: 'Private Company',
      lushaSpecialities: ['data enrichment', 'sales intelligence'],
      lushaTechnologies: ['amazon', 'google analytics'],
      lushaSicCodes: ['7371 - Custom computer programming services'],
      lushaNaicsCodes: ['541511 - Custom Computer Programming Services'],
      lushaTotalFunding: { amountMicros: 245000000000000, currencyCode: 'USD' },
      lushaLastFundingType: 'Private Equity Round',
      lushaLastFundingDate: '2021-11-10',
      lushaLinkedinFollowers: 64339,
      lushaXLink: {
        primaryLinkUrl: 'https://x.com/lusha',
        primaryLinkLabel: '',
        secondaryLinks: null,
      },
      lushaFacebookLink: {
        primaryLinkUrl: 'https://www.facebook.com/lusha',
        primaryLinkLabel: '',
        secondaryLinks: null,
      },
      lushaPhones: {
        primaryPhoneNumber: '(617) 555-0142',
        primaryPhoneCountryCode: 'US',
        primaryPhoneCallingCode: '',
        additionalPhones: [
          { number: '+1 800-420-7332', countryCode: '', callingCode: '' },
        ],
      },
      lushaLocation: {
        addressStreet1: '',
        addressStreet2: '',
        addressCity: 'Boston',
        addressState: 'Massachusetts',
        addressPostcode: '02199',
        addressCountry: 'United States',
        addressLat: null,
        addressLng: null,
      },
      lushaLastEnrichedAt: '2026-09-17T10:00:00.000Z',
      lushaEnrichmentStatus: 'ENRICHED',
      lushaRawPayload: LUSHA_COMPANY_MOCK,
    });
  });
});
