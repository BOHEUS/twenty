import { describe, expect, it } from 'vitest';

import { buildTwentyCompany } from 'src/logic-functions/data/build-twenty-company.util';

const ENRICHED_AT = '2026-09-22T10:00:00.000Z';

describe('buildTwentyCompany', () => {
  it('should map the documented company payload', () => {
    const company = buildTwentyCompany({
      enrichedAt: ENRICHED_AT,
      company: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Example Inc',
        domain: 'example.com',
        website: 'https://www.example.com',
        description: 'Leading example company',
        year_founded: 2010,
        headcount: 250,
        headcount_range: '201-500',
        company_type: 'Privately Held',
        locations: {
          headquarters: {
            line1: '123 Market St',
            line2: 'San Francisco, CA 94105, US',
            city: 'San Francisco',
            region: 'California',
            country: 'United States',
          },
          offices: [{ line1: '456 Broadway', line2: 'New York, NY 10013, US' }],
        },
        industry: { main_industry: 'Software Development' },
        specialties: ['Data Enrichment'],
        social_profiles: {
          professional_network: {
            url: 'https://www.linkedin.com/company/example-inc',
            handle: 'example-inc',
            connection_count: 12000,
          },
        },
      },
    });

    expect(company).toMatchObject({
      name: 'Example Inc',
      domainName: { primaryLinkLabel: '', primaryLinkUrl: 'example.com' },
      fullEnrichHeadcount: 250,
      fullEnrichHeadcountRange: '201-500',
      fullEnrichCompanyType: 'PRIVATELY_HELD',
      fullEnrichIndustry: 'Software Development',
      fullEnrichYearFounded: 2010,
      fullEnrichLinkedinFollowerCount: 12000,
      fullEnrichEnrichedAt: ENRICHED_AT,
    });
  });

  it('should keep the unparsed location string out of the second street line', () => {
    const company = buildTwentyCompany({
      enrichedAt: ENRICHED_AT,
      company: {
        locations: {
          headquarters: {
            line1: '123 Market St',
            line2: 'San Francisco, CA 94105, US',
            city: 'San Francisco',
            region: 'California',
            country: 'United States',
          },
        },
      },
    });

    expect(company.address).toEqual({
      addressStreet1: '123 Market St',
      addressStreet2: '',
      addressCity: 'San Francisco',
      addressState: 'California',
      addressPostcode: '',
      addressCountry: 'United States',
    });
  });

  it('should not blank out an address when headquarters comes back empty', () => {
    const company = buildTwentyCompany({
      enrichedAt: ENRICHED_AT,
      company: { name: 'Example Inc', locations: { headquarters: {} } },
    });

    expect(company).not.toHaveProperty('address');
  });

  it('should treat a zero year founded and headcount as unknown', () => {
    const company = buildTwentyCompany({
      enrichedAt: ENRICHED_AT,
      company: { year_founded: 0, headcount: 0, headcount_range: '11-50' },
    });

    expect(company).not.toHaveProperty('fullEnrichYearFounded');
    expect(company).not.toHaveProperty('fullEnrichHeadcount');
    expect(company.fullEnrichHeadcountRange).toBe('11-50');
  });

  it('should fall back to the website when no bare domain came back', () => {
    const company = buildTwentyCompany({
      enrichedAt: ENRICHED_AT,
      company: { website: 'https://www.example.com/careers?utm=x' },
    });

    expect(company.domainName?.primaryLinkUrl).toBe('example.com');
  });
});
