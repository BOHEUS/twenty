type RocketReachCompanyAddress = {
  description?: string | null;
  street?: string | null;
  city?: string | null;
  region?: string | null;
  region_code?: string | null;
  postal_code?: string | null;
  country?: string | null;
  country_code?: string | null;
};

type RocketReachCompanyGrowthEntry = {
  year?: number | null;
  quarter?: number | null;
  values?: number[] | null;
};

export type RocketReachCompanyData = {
  id?: number | null;
  name?: string | null;
  domain?: string | null;
  email_domain?: string | null;
  website_domain?: string | null;
  rr_profile_url?: string | null;
  links?: Record<string, unknown> | null;

  address?: RocketReachCompanyAddress | null;
  phone?: string | null;
  fax?: string | null;

  description?: string | null;
  industry?: string | null;
  industries?: string[] | null;
  industry_keywords?: string[] | null;
  sic_codes?: number[] | null;
  naics_codes?: number[] | null;
  techstack?: string[] | null;
  competitors?: string[] | null;
  departments?: Record<string, unknown> | null;
  company_growth?: RocketReachCompanyGrowthEntry[] | null;

  num_employees?: number | null;
  year_founded?: number | null;
  revenue?: number | null;
  ticker_symbol?: string | null;
  funding_investors?: string[] | null;
};
