export type AmplemarketLocation = {
  address?: string | null;
  is_primary?: boolean | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  postal_code?: string | null;
};

export type AmplemarketCompany = {
  id?: string | null;
  name?: string | null;
  website?: string | null;
  linkedin_url?: string | null;
  keywords?: string[] | null;
  industry?: string | null;
  type?: string | null;
  size?: string | null;
  overview?: string | null;
  founded_year?: number | null;
  traffic_rank?: number | null;
  followers?: number | null;
  estimated_number_of_employees?: number | null;
  department_headcount?: Record<string, unknown> | null;
  job_function_headcount?: Record<string, unknown> | null;
  estimated_revenue?: string | null;
  revenue?: number | null;
  locations?: AmplemarketLocation[] | null;
  sic_codes?: (string | number)[] | null;
  naics_codes?: (string | number)[] | null;
  is_b2b?: boolean | null;
  is_b2c?: boolean | null;
  technologies?: string[] | null;
  total_funding?: number | null;
  latest_funding_stage?: string | null;
  latest_funding_date?: string | null;
  funding_events?: Record<string, unknown>[] | null;
};
