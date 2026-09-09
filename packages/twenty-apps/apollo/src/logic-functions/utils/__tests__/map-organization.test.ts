import { describe, expect, it } from 'vitest';

import {
  buildCompanyApolloData,
  buildCompanyStandardData,
} from 'src/logic-functions/utils/map-organization';

const ENRICHED_AT = '2026-09-09T10:00:00.000Z';

const organization = {
  id: '5e66b6381e05b4008c8331b8',
  name: 'Apollo',
  website_url: 'https://www.apollo.io',
  primary_domain: 'apollo.io',
  linkedin_url: 'https://www.linkedin.com/company/apolloio',
  twitter_url: 'https://twitter.com/meetapollo',
  facebook_url: 'https://www.facebook.com/meetapollo',
  crunchbase_url: 'https://www.crunchbase.com/organization/apollo-io',
  angellist_url: null,
  blog_url: 'https://www.apollo.io/blog',
  logo_url: 'https://zenprospect.s3.amazonaws.com/logo.png',
  phone: '+1 415-555-0100',
  industry: 'information technology & services',
  secondary_industries: ['computer software'],
  keywords: ['sales engagement', 'lead generation'],
  short_description: 'Apollo is a sales intelligence platform.',
  seo_description: 'Find and engage your ideal buyers.',
  founded_year: 2015,
  total_funding: 251_000_000,
  annual_revenue: 100_000_000,
  latest_funding_stage: 'Series D',
  latest_funding_round_date: '2023-08-30T00:00:00.000+00:00',
  funding_events: [{ id: '1', type: 'Series D', amount: '100000000' }],
  estimated_num_employees: 900,
  departmental_head_count: { engineering: 240, sales: 310 },
  organization_headcount_six_month_growth: 0.04,
  organization_headcount_twelve_month_growth: 0.11,
  organization_headcount_twenty_four_month_growth: 0.32,
  publicly_traded_symbol: null,
  linkedin_uid: '18933078',
  alexa_ranking: 4512,
  languages: ['English'],
  technology_names: ['Amazon AWS', 'Google Analytics'],
  current_technologies: [{ uid: 'amazon_aws', name: 'Amazon AWS' }],
  num_retail_locations: 3,
  owned_by_organization_id: null,
  suborganizations: [{ id: '2', name: 'Apollo Labs' }],
  num_suborganizations: 1,
  account_id: '6011d2b0b8f1b1000144d6cd',
  street_address: '535 Mission St',
  city: 'San Francisco',
  state: 'California',
  postal_code: '94105',
  country: 'United States',
};

describe('buildCompanyStandardData', () => {
  it('should map the values the standard Company object already holds', () => {
    expect(buildCompanyStandardData(organization)).toEqual({
      name: 'Apollo',
      domainName: {
        primaryLinkUrl: 'https://www.apollo.io',
        primaryLinkLabel: 'Website',
      },
      linkedinLink: {
        primaryLinkUrl: 'https://www.linkedin.com/company/apolloio',
        primaryLinkLabel: 'LinkedIn',
      },
      annualRevenue: { amountMicros: 100_000_000_000_000, currencyCode: 'USD' },
      address: {
        addressStreet1: '535 Mission St',
        addressCity: 'San Francisco',
        addressState: 'California',
        addressPostcode: '94105',
        addressCountry: 'United States',
      },
    });
  });

  it('should omit values Apollo did not return', () => {
    expect(buildCompanyStandardData({ name: 'Apollo' })).toEqual({
      name: 'Apollo',
    });
  });
});

describe('buildCompanyApolloData', () => {
  const data = buildCompanyApolloData({
    organization,
    enrichedAt: ENRICHED_AT,
  });

  it('should map the values the standard Company object has no field for', () => {
    expect(data).toMatchObject({
      apolloOrganizationId: '5e66b6381e05b4008c8331b8',
      apolloIndustry: 'information technology & services',
      apolloSecondaryIndustries: ['computer software'],
      apolloKeywords: ['sales engagement', 'lead generation'],
      apolloShortDescription: 'Apollo is a sales intelligence platform.',
      apolloSeoDescription: 'Find and engage your ideal buyers.',
      apolloFoundedYear: 2015,
      apolloTotalFunding: {
        amountMicros: 251_000_000_000_000,
        currencyCode: 'USD',
      },
      apolloLatestFundingStage: 'Series D',
      apolloEstimatedNumEmployees: 900,
      apolloDepartmentalHeadCount: { engineering: 240, sales: 310 },
      apolloHeadcountGrowthSixMonths: 0.04,
      apolloHeadcountGrowthTwelveMonths: 0.11,
      apolloHeadcountGrowthTwentyFourMonths: 0.32,
      apolloLinkedinUid: '18933078',
      apolloAlexaRanking: 4512,
      apolloLanguages: ['English'],
      apolloTechnologyNames: ['Amazon AWS', 'Google Analytics'],
      apolloRetailLocationCount: 3,
      apolloAccountId: '6011d2b0b8f1b1000144d6cd',
      apolloLastEnrichedAt: ENRICHED_AT,
      apolloEnrichmentStatus: 'ENRICHED',
    });
  });

  it('should turn social urls into links', () => {
    expect(data.apolloXLink).toEqual({
      primaryLinkUrl: 'https://twitter.com/meetapollo',
      primaryLinkLabel: 'X',
    });
    expect(data.apolloFacebookLink).toEqual({
      primaryLinkUrl: 'https://www.facebook.com/meetapollo',
      primaryLinkLabel: 'Facebook',
    });
  });

  it('should read the company phone Apollo returns', () => {
    expect(data.apolloPhones).toEqual({
      primaryPhoneNumber: '+1 415-555-0100',
    });
  });

  it('should fold the ownership fields into the corporate hierarchy', () => {
    expect(data.apolloCorporateHierarchy).toEqual({
      suborganizations: [{ id: '2', name: 'Apollo Labs' }],
      numSuborganizations: 1,
    });
  });

  it('should keep the full payload so nothing Apollo returned is lost', () => {
    expect(data.apolloRawPayload).toBe(organization);
  });

  it('should omit fields Apollo returned as null', () => {
    expect(data).not.toHaveProperty('apolloAngellistLink');
    expect(data).not.toHaveProperty('apolloPubliclyTradedSymbol');
  });

  it('should still record the run when Apollo returned almost nothing', () => {
    expect(
      buildCompanyApolloData({ organization: {}, enrichedAt: ENRICHED_AT }),
    ).toEqual({
      apolloLastEnrichedAt: ENRICHED_AT,
      apolloEnrichmentStatus: 'ENRICHED',
      apolloRawPayload: {},
    });
  });
});
