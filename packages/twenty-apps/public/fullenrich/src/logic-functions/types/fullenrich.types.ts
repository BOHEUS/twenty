import { type FullEnrichEnrichField } from 'src/constants/application-variables';

export type FullEnrichCustomProperties = {
  personId: string;
  companyId?: string;
};

// FullEnrich matches a contact either on linkedin_url, or on first_name plus
// last_name together with domain or company_name. The API rejects a contact
// that satisfies neither, so the rule is enforced where the contact is built.
export type FullEnrichRequestContact = {
  enrich_fields: FullEnrichEnrichField[];
  custom?: FullEnrichCustomProperties;
  linkedin_url?: string;
  first_name?: string;
  last_name?: string;
  domain?: string;
  company_name?: string;
};

export type FullEnrichRequest = {
  name: string;
  webhook_url: string;
  webhook_events?: {
    contact_finished?: string;
  };
  data: FullEnrichRequestContact[];
};

export type FullEnrichEnrichmentStatus =
  | 'CREATED'
  | 'IN_PROGRESS'
  | 'CANCELED'
  | 'CREDITS_INSUFFICIENT'
  | 'FINISHED'
  | 'RATE_LIMIT'
  | 'UNKNOWN';

export type FullEnrichWebhookPayload = {
  id: string;
  name: string;
  status: FullEnrichEnrichmentStatus;
  cost: {
    credits: number;
  };
  data: FullEnrichContactData[];
};

export type FullEnrichContactData = {
  input: FullEnrichContactInput;
  custom?: FullEnrichCustomProperties;
  contact_info?: FullEnrichContactInfo;
  profile?: FullEnrichProfile;
};

export type FullEnrichContactInput = {
  professional_network_url?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  company_name?: string;
  company_domain?: string;
};

export type FullEnrichContactInfo = {
  most_probable_work_email?: FullEnrichEmail;
  most_probable_personal_email?: FullEnrichEmail;
  most_probable_phone?: FullEnrichPhone | null;
  work_emails?: FullEnrichEmail[];
  personal_emails?: FullEnrichEmail[];
  phones?: FullEnrichPhone[];
};

export type FullEnrichEmailStatus =
  | 'DELIVERABLE'
  | 'HIGH_PROBABILITY'
  | 'CATCH_ALL'
  | 'INVALID'
  | 'INVALID_DOMAIN';

export type FullEnrichEmail = {
  email: string;
  status: FullEnrichEmailStatus;
};

export type FullEnrichPhone = {
  number: string;
  region: string;
  line_type?: 'MOBILE' | 'LANDLINE' | 'VOIP' | 'UNKNOWN';
  line_status?: 'ACTIVE' | 'INACTIVE' | 'UNKNOWN';
  ownership_match?: 'CONFIRMED' | 'MISMATCH';
  ownership_match_confidence?: number;
  connect_rate?: 'HIGHEST' | 'HIGH' | 'MEDIUM';
};

// Only returned when linkedin_url was part of the request
export type FullEnrichProfile = {
  id?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  headline?: string;
  description?: string;
  location?: FullEnrichLocation;
  social_profiles?: FullEnrichSocialProfiles;
  educations?: FullEnrichEducation[];
  languages?: FullEnrichLanguage[];
  skills?: string[];
  employment?: FullEnrichEmployment;
};

export type FullEnrichLocation = {
  country?: string;
  country_code?: string;
  city?: string;
  region?: string;
};

export type FullEnrichEducation = {
  school_name?: string;
  degree?: string;
  start_at?: string;
  end_at?: string;
};

export type FullEnrichLanguageProficiency =
  | 'NATIVE_OR_BILINGUAL'
  | 'FULL_PROFESSIONAL'
  | 'PROFESSIONAL_WORKING'
  | 'LIMITED_WORKING'
  | 'ELEMENTARY';

export type FullEnrichLanguage = {
  language?: string;
  proficiency?: FullEnrichLanguageProficiency;
};

export type FullEnrichEmployment = {
  current?: FullEnrichJobPosition;
  all?: FullEnrichJobPosition[];
};

export type FullEnrichJobPosition = {
  title?: string;
  seniority?: string;
  job_functions?: FullEnrichJobFunction[];
  description?: string;
  company?: FullEnrichCompany;
  is_current?: boolean;
  start_at?: string;
  end_at?: string;
};

export type FullEnrichJobFunction = {
  function?: string;
  sub_function?: string;
};

export type FullEnrichCompany = {
  id?: string;
  name?: string;
  domain?: string;
  website?: string;
  description?: string;
  year_founded?: number;
  headcount?: number;
  headcount_range?: string;
  company_type?: string;
  locations?: {
    headquarters?: FullEnrichCompanyAddress;
    offices?: FullEnrichOfficeAddress[] | null;
  };
  social_profiles?: FullEnrichSocialProfiles;
  specialties?: string[] | null;
  industry?: {
    main_industry?: string;
  };
  logo_url?: string;
};

export type FullEnrichCompanyAddress = {
  line1?: string;
  // Full location string: city, region, postal code and country code
  line2?: string;
  city?: string;
  region?: string;
  country?: string;
  country_code?: string;
};

export type FullEnrichOfficeAddress = {
  line1?: string;
  line2?: string;
};

export type FullEnrichSocialProfiles = {
  professional_network?: FullEnrichSocialProfile;
};

export type FullEnrichSocialProfile = {
  id?: number;
  url?: string;
  handle?: string;
  connection_count?: number;
};
