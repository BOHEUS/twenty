type RocketReachEmail = {
  email?: string | null;
  type?: string | null;
  smtp_valid?: string | null;
  grade?: string | null;
  last_validation_check?: string | null;
};

export type RocketReachPhone = {
  number?: string | null;
  e164?: string | null;
  country_code?: string | null;
  extension?: string | null;
  type?: string | null;
  grade?: string | null;
  recommended?: boolean | null;
};

export type RocketReachJobHistoryEntry = {
  company_name?: string | null;
  company_id?: number | null;
  company_linkedin_url?: string | null;
  title?: string | null;
  department?: string | null;
  sub_department?: string | null;
  highest_level?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean | null;
};

export type RocketReachPersonData = {
  id?: number | null;
  status?: string | null;
  name?: string | null;

  linkedin_url?: string | null;
  linkedin_url_active?: boolean | null;
  connections?: number | null;
  links?: Record<string, unknown> | null;

  location?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  country_code?: string | null;
  region_latitude?: number | null;
  region_longitude?: number | null;
  birth_year?: string | number | null;

  current_title?: string | null;
  current_employer?: string | null;
  current_employer_id?: number | null;
  current_employer_domain?: string | null;
  current_employer_website?: string | null;
  current_employer_linkedin_url?: string | null;
  current_employer_industry?: string | null;

  job_history?: RocketReachJobHistoryEntry[] | null;
  education?: unknown[] | null;
  skills?: string[] | null;

  recommended_email?: string | null;
  recommended_professional_email?: string | null;
  recommended_personal_email?: string | null;
  current_work_email?: string | null;
  current_personal_email?: string | null;
  emails?: RocketReachEmail[] | null;

  phones?: RocketReachPhone[] | null;

  npi_data?: Record<string, unknown> | null;
};
