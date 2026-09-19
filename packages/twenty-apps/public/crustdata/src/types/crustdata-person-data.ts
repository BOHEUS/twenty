export type CrustdataEmail = {
  email?: string | null;
  status?: string | null;
  last_updated?: string | null;
};

export type CrustdataContact = {
  business_emails?: CrustdataEmail[] | null;
  personal_emails?: CrustdataEmail[] | null;
  phone_numbers?: string[] | null;
  websites?: string[] | null;
  last_updated?: string | null;
};

export type CrustdataEmploymentEntry = {
  name?: string | null;
  title?: string | null;
  company_website_domain?: string | null;
  company_website?: string | null;
  company_professional_network_url?: string | null;
  crustdata_company_id?: number | null;
  start_date?: string | null;
  end_date?: string | null;
};

export type CrustdataPersonData = {
  crustdata_person_id?: number | null;
  updated_at?: string | null;

  basic_profile?: {
    name?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    headline?: string | null;
    summary?: string | null;
    current_title?: string | null;
    professional_network_name?: string | null;
    languages?: unknown[] | null;
    last_updated?: string | null;
    profile_picture_permalink?: string | null;
    normalized_title?: {
      matched_title?: string | null;
      department?: string | null;
      sub_department?: string | null;
    } | null;
    location?: {
      raw?: string | null;
      city?: string | null;
      state?: string | null;
      country?: string | null;
      continent?: string | null;
    } | null;
  } | null;

  professional_network?: {
    profile_picture_permalink?: string | null;
    pronoun?: string | null;
    connections?: number | null;
    followers?: number | null;
    joined_date?: string | null;
  } | null;

  social_handles?: {
    professional_network_identifier?: { profile_url?: string | null } | null;
    dev_platform_identifier?: { profile_url?: string | null } | null;
    twitter_identifier?: { slug?: string | null } | null;
  } | null;

  experience?: {
    employment_details?: {
      current?: CrustdataEmploymentEntry[] | null;
      past?: CrustdataEmploymentEntry[] | null;
    } | null;
    years_of_experience?: string | null;
    years_of_experience_raw?: number | null;
  } | null;

  education?: { schools?: unknown[] | null } | null;
  skills?: { professional_network_skills?: string[] | null } | null;
  certifications?: unknown[] | null;
  honors?: unknown[] | null;
  dev_platform_profiles?: unknown[] | null;

  assessment?: {
    authenticity?: {
      verdict?: string | null;
      tier?: number | null;
    } | null;
  } | null;

  contact?: CrustdataContact | null;
};
