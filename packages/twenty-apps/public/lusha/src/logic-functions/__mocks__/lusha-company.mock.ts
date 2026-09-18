import { type LushaRecord } from 'src/logic-functions/types/lusha-record.type';

// Shaped after the search-and-enrich example of the Lusha V3 documentation.
export const LUSHA_COMPANY_MOCK: LushaRecord = {
  clientReferenceId: 'company-1',
  id: '16303253',
  name: 'Lusha',
  domain: 'www.lusha.com',
  description: 'Lusha is the leader in Sales Streaming.',
  companyType: 'Private Company',
  yearFounded: 2016,
  employeeCount: { exact: 364, min: 201, max: 500 },
  industry: 'Technology, Information & Media',
  subIndustry: 'Software Development',
  specialities: ['data enrichment', 'sales intelligence', 'Data Enrichment'],
  sicCodes: [
    { code: 7371, description: 'Custom computer programming services' },
  ],
  naicsCodes: [
    { code: 541511, description: 'Custom Computer Programming Services' },
  ],
  location: {
    city: 'Boston',
    state: 'Massachusetts',
    country: 'United States',
    countryIso2: 'US',
    continent: 'North America',
    zipCode: '02199',
  },
  socialLinks: {
    linkedin: 'https://www.linkedin.com/company/lushadata',
    facebook: 'https://www.facebook.com/lusha',
    x: 'https://x.com/lusha',
  },
  linkedinFollowers: 64339,
  revenueRange: { min: 10000000, max: 50000000 },
  funding: {
    rounds: [
      {
        currency: 'USD',
        roundAmount: 205000000,
        roundType: 'Private Equity Round',
        roundDate: 'Nov 10, 2021',
      },
    ],
    totalRounds: 2,
    totalRoundsAmount: 245000000,
    currency: 'USD',
    isIpo: false,
    lastRoundType: 'Private Equity Round',
    lastRoundAmount: 205000000,
    lastRoundDate: 'Nov 10, 2021',
  },
  technologies: ['amazon', 'google analytics'],
  phone: '(617) 555-0142',
};
