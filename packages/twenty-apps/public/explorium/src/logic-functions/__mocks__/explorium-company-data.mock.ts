import { type ExploriumCompanyData } from 'src/types/explorium-company-data';

export const EXPLORIUM_COMPANY_DATA_MOCK: ExploriumCompanyData = {
  business_id: '8adce3ca1cef0c986b22310e369a0793',
  name: 'Acme Corp',
  business_description: 'Makes anvils.',
  website: 'https://www.acme.com',
  country_name: 'united states',
  region_name: 'california',
  city_name: 'san francisco',
  street: '1 Market St',
  zip_code: '94105',
  naics: '332999',
  naics_description:
    'All Other Miscellaneous Fabricated Metal Product Manufacturing',
  sic_code: '3499',
  sic_code_description: 'Fabricated Metal Products',
  ticker: 'NASDAQ:ACME',
  number_of_employees_range: '201-500',
  yearly_revenue_range: '25M-75M',
  linkedin_industry_category: 'Manufacturing',
  linkedin_profile: 'https://www.linkedin.com/company/acme',
  locations_distribution: [{ country: 'united states', locations: 3 }],
};
