export type DropcontactEmail = {
  email?: string | null;
  qualification?: string | null;
};

export type DropcontactPersonData = {
  civility?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  email?: DropcontactEmail[] | string | null;
  phone?: string | null;
  mobile_phone?: string | null;
  company?: string | null;
  website?: string | null;
  linkedin?: string | null;
  company_linkedin?: string | null;
  job?: string | null;
  job_level?: string | null;
  job_function?: string | null;
  nb_employees?: string | null;
  employee_count?: string | null;
  industry?: string | null;
  company_turnover?: string | null;
  company_results?: string | null;
  siren?: string | null;
  siret?: string | null;
  siret_address?: string | null;
  siret_zip?: string | null;
  siret_city?: string | null;
  vat?: string | null;
  naf5_code?: string | null;
  naf5_des?: string | null;
  country?: string | null;
  custom_fields?: Record<string, string> | null;
};
