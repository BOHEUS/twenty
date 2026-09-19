import { type CrustdataCompanyData } from 'src/types/crustdata-company-data';

// Shaped after the documented /company/enrich response sections.
export const crustdataCompanyDataMock: CrustdataCompanyData = {
  crustdata_company_id: 9911,
  updated_at: '2026-08-20T11:00:00Z',
  basic_info: {
    name: 'Analytical Engines',
    primary_domain: 'analyticalengines.com',
    all_domains: ['analyticalengines.com', 'analytical.dev'],
    website: 'https://analyticalengines.com',
    professional_network_url:
      'https://www.linkedin.com/company/analytical-engines',
    professional_network_id: 4455,
    year_founded: 2019,
    description: 'Computation for everyone.',
    company_type: 'Privately Held',
    status: 'Operating',
    employee_count_range: '201-500',
    markets: ['B2B'],
    industries: ['Software Development'],
  },
  taxonomy: {
    categories: ['Developer Tools'],
    professional_network_specialities: ['Compilers', 'Runtimes'],
    primary_naics_detail: { code: '541511', title: 'Custom Programming' },
    sic_detail_list: [{ code: '7371' }],
  },
  locations: {
    country: 'United Kingdom',
    state: 'England',
    headquarters: '1 Engine Way, London EC1A 1AA',
    street_address: '1 Engine Way',
    all_office_addresses: ['1 Engine Way, London'],
  },
  headcount: {
    total: 312,
    by_role_absolute: { engineering: 140 },
    by_region_absolute: { europe: 210 },
    growth_percent: { mom: 1.2, yoy: 18.4 },
  },
  funding: {
    total_investment_usd: 82_000_000,
    last_round_amount_usd: 50_000_000,
    last_fundraise_date: '2025-11-03',
    last_round_type: 'Series B',
    investors: ['Babbage Ventures'],
    acquisitions: [{ name: 'Punchcard Inc' }],
  },
  revenue: {
    estimated: { lower_bound_usd: 25_000_000, upper_bound_usd: 50_000_000 },
    public_markets: { stock_symbols: ['AENG'], ipo_date: '2026-02-10' },
    acquisition_status: 'Independent',
  },
  hiring: {
    openings_count: 24,
    openings_growth_percent: 12.5,
    recent_openings: [{ title: 'Staff Engineer' }],
  },
  followers: { count: 48_000 },
  seo: { monthly_organic_clicks: 91_000 },
  web_traffic: { monthly_visitors: 220_000 },
  competitors: { all_domains: ['differenceengine.com'] },
  employee_reviews: { overall_rating: 4.3, review_count: 180 },
  software_reviews: { average_rating: 4.6 },
  people: { founders: [{ name: 'Charles Babbage' }] },
  news: [{ article_title: 'Analytical Engines raises Series B' }],
  social_profiles: {
    crunchbase: { url: 'https://crunchbase.com/organization/analytical-engines' },
    twitter_url: 'https://x.com/analyticaleng',
  },
};
