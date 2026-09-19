export type CrustdataCompanyData = {
  crustdata_company_id?: number | null;
  updated_at?: string | null;

  basic_info?: {
    name?: string | null;
    primary_domain?: string | null;
    all_domains?: string[] | null;
    website?: string | null;
    professional_network_url?: string | null;
    professional_network_id?: string | number | null;
    year_founded?: number | string | null;
    description?: string | null;
    company_type?: string | null;
    status?: string | null;
    employee_count_range?: string | null;
    markets?: string[] | null;
    industries?: string[] | null;
  } | null;

  taxonomy?: {
    categories?: string[] | null;
    professional_network_industry?: string | null;
    professional_network_industries?: string[] | null;
    professional_network_specialities?: string[] | null;
    primary_naics_detail?: unknown;
    sic_detail_list?: unknown[] | null;
  } | null;

  locations?: {
    country?: string | null;
    state?: string | null;
    headquarters?: string | null;
    street_address?: string | null;
    all_office_addresses?: unknown[] | null;
  } | null;

  headcount?: {
    total?: number | null;
    by_role_absolute?: Record<string, unknown> | null;
    by_region_absolute?: Record<string, unknown> | null;
    growth_percent?: Record<string, unknown> | null;
    growth_absolute?: Record<string, unknown> | null;
  } | null;

  funding?: {
    total_investment_usd?: number | null;
    last_round_amount_usd?: number | null;
    last_fundraise_date?: string | null;
    last_round_type?: string | null;
    investors?: unknown[] | null;
    funding_rounds?: unknown[] | null;
    acquisitions?: unknown;
    acquired_by?: unknown;
  } | null;

  revenue?: {
    estimated?: {
      lower_bound_usd?: number | null;
      upper_bound_usd?: number | null;
    } | null;
    public_markets?: {
      stock_symbols?: unknown[] | null;
      ipo_date?: string | null;
    } | null;
    acquisition_status?: string | null;
  } | null;

  hiring?: {
    openings_count?: number | null;
    openings_growth_percent?: number | null;
    recent_openings?: unknown[] | null;
  } | null;

  followers?: { count?: number | null } | null;
  seo?: Record<string, unknown> | null;
  web_traffic?: Record<string, unknown> | null;
  competitors?: Record<string, unknown> | null;

  employee_reviews?: {
    overall_rating?: number | { rating?: number | null } | null;
    review_count?: number | null;
  } | null;

  software_reviews?: {
    average_rating?: number | null;
    review_count?: number | null;
  } | null;

  people?: {
    founders?: unknown[] | null;
    cxos?: unknown[] | null;
    decision_makers?: unknown[] | null;
  } | null;

  news?: unknown[] | null;

  social_profiles?: {
    crunchbase?: { url?: string | null; uuid?: string | null } | null;
    professional_network?: string | null;
    twitter_url?: string | null;
  } | null;
};
