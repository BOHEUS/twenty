export type ExploriumProfileData = {
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  gender?: string | null;
  age_group?: string | null;
  city?: string | null;
  region_name?: string | null;
  country_name?: string | null;
  linkedin?: string | null;
  linkedin_url_array?: string[] | null;
  company_name?: string | null;
  company_website?: string | null;
  company_linkedin?: string | null;
  job_title?: string | null;
  job_department_main?: string | null;
  job_department_array?: string[] | null;
  job_level_main?: string | null;
  job_level_array?: string[] | null;
  experience?: Record<string, unknown>[] | null;
  education?: Record<string, unknown>[] | null;
  skills?: string[] | null;
  interests?: string[] | null;
};

export type ExploriumContactInformationData = {
  professional_email?: string | null;
  professional_email_status?: string | null;
  phone_numbers?: Record<string, string>[] | null;
  mobile_phone?: string | null;
};

export type ExploriumPersonData = ExploriumProfileData &
  ExploriumContactInformationData & { prospect_id: string };
