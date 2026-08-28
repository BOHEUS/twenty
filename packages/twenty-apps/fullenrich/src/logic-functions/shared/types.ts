export type fullEnrichRequest = {
  name: string;
  webhook_url: string;
  webhook_events?: {
    contact_finished?: string;
  };
  data: fullEnrichRequestData[];
}

export type fullEnrichEnrichField =
  | 'contact.work_emails'
  | 'contact.phones'
  | 'contact.personal_emails';

type fullEnrichRequestDataBase = {
  enrich_fields: fullEnrichEnrichField[];
  custom?: fullEnrichCustomProperties;
}

// FullEnrich accepts a contact identified either by name plus company, or by
// its professional network URL alone
type fullEnrichRequestDataFromName = fullEnrichRequestDataBase & {
  first_name: string;
  last_name: string;
  linkedin_url?: string;
} & (
    | { domain: string; company_name?: string }
    | { domain?: string; company_name: string }
  );

type fullEnrichRequestDataFromLinkedin = fullEnrichRequestDataBase & {
  linkedin_url: string;
  first_name?: string;
  last_name?: string;
  domain?: string;
  company_name?: string;
}

export type fullEnrichRequestData =
  | fullEnrichRequestDataFromName
  | fullEnrichRequestDataFromLinkedin;

export type fullEnrichCustomProperties = {
  companyId: string;
  personId: string;
}

type twentyDomainName = {
  primaryLinkLabel: string;
  primaryLinkUrl: string;
}

type twentyAddress = {
  addressStreet1: string;
  addressStreet2: string;
  addressCity: string;
  addressCountry: string;
  addressState: string;
  addressZipCode: string;
}

export const TWENTY_COMPANY_TYPES = [
  'PRIVATELY_HELD',
  'PUBLIC_COMPANY',
  'PARTNERSHIP',
  'NONPROFIT',
  'EDUCATIONAL',
  'GOVERNMENT_AGENCY',
  'SELF_OWNED',
  'SELF_EMPLOYED',
] as const;

export type twentyCompanyType = (typeof TWENTY_COMPANY_TYPES)[number];

export type twentyCompany = {
  id: string;
  name: string;
  domainName: twentyDomainName;
  linkedinLink: twentyDomainName;
  address: twentyAddress;
  description: string | null;
  yearFounded: number | null;
  headcount: number | null;
  headcountRange: HeadCountRange | null;
  companyType: twentyCompanyType | null;
  industry: string | null;
  specialties: string[] | null;
  logo: twentyDomainName | null;
  officeLocations: OfficeLocation[] | null;
  linkedinFollowerCount: number | null;
  fullEnrichCompanyId: string | null;
  enrichedAt: string | null;
}

type twentyPersonName = {
  firstName: string;
  lastName: string;
}

export type twentyPersonSocialMedia = {
  primaryLinkLabel: string;
  primaryLinkUrl: string;
}

type twentyPersonEmail = {
  primaryEmail: string;
  additionalEmails: string[] | null;
}

export type twentyAdditionalPhone = {
  number: string;
  callingCode: string;
  countryCode: string;
}

export type twentyPersonPhones = {
  primaryPhoneNumber: string;
  primaryPhoneCallingCode: string;
  primaryPhoneCountryCode: string;
  additionalPhones: twentyAdditionalPhone[] | null;
}

export const TWENTY_SENIORITIES = [
  'OWNER',
  'FOUNDER',
  'C_LEVEL',
  'PARTNER',
  'VP',
  'HEAD',
  'DIRECTOR',
  'MANAGER',
  'SENIOR',
] as const;

export type twentySeniority = (typeof TWENTY_SENIORITIES)[number];

export type twentyPerson = {
  id: string;
  name: twentyPersonName;
  emails: twentyPersonEmail;
  linkedinLink: twentyPersonSocialMedia;
  jobTitle: string;
  phones: twentyPersonPhones;
  companyId: string | null;
  headline: string | null;
  about: string | null;
  location: twentyAddress | null;
  skills: string[] | null;
  languages: Language[] | null;
  educations: Education[] | null;
  seniority: twentySeniority | null;
  jobFunction: string | null;
  jobSubFunction: string | null;
  employmentHistory: JobPosition[] | null;
  currentRoleStartedAt: string | null;
  linkedinConnectionCount: number | null;
  fullEnrichPersonId: string | null;
  enrichedAt: string | null;
}

export type EnrichmentResponse = {
  id: string;
  name: string;
  status:
    | 'CREATED'
    | 'IN_PROGRESS'
    | 'CANCELED'
    | 'CREDITS_INSUFFICIENT'
    | 'FINISHED'
    | 'RATE_LIMIT'
    | 'UNKNOWN';
  cost: {
    credits: number;
  };
  data: ContactData[];
};

export type ContactData = {
  input: ContactInput;
  custom?: fullEnrichCustomProperties;
  contact_info?: ContactInfo;
  profile?: Profile;
};

export type ContactInput = {
  professional_network_url?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  company_name?: string;
  company_domain?: string;
};

export type ContactInfo = {
  most_probable_work_email?: EmailInfo;
  most_probable_phone?: PhoneInfo;
  most_probable_personal_email?: EmailInfo;
  work_emails?: EmailInfo[];
  personal_emails?: EmailInfo[];
  phones?: PhoneInfo[];
};

export type EmailInfo = {
  email: string;
  status:
    | 'DELIVERABLE'
    | 'HIGH_PROBABILITY'
    | 'CATCH_ALL'
    | 'INVALID'
    | 'INVALID_DOMAIN';
};

export type PhoneInfo = {
  number: string;
  region: string;
};

export type Profile = {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  headline: string;
  description?: string;
  location: Location;
  social_profiles?: SocialProfiles;
  educations: Education[];
  languages: Language[];
  skills?: string[];
  employment?: Employment;
};

export type Location = {
  country: string;
  country_code: string;
  city: string;
  region: string;
};

export type Education = {
  school_name: string;
  degree: string;
  start_at: string;
  end_at: string;
};

export type LanguageProficiency =
  | 'NATIVE_OR_BILINGUAL'
  | 'FULL_PROFESSIONAL'
  | 'PROFESSIONAL_WORKING'
  | 'LIMITED_WORKING'
  | 'ELEMENTARY';

export type Language = {
  language: string;
  proficiency: LanguageProficiency;
};

export type Employment = {
  current?: JobPosition;
  all?: JobPosition[];
};

export type JobPosition = {
  title: string;
  seniority?: string;
  job_functions?: JobFunction[];
  description?: string;
  company: Company;
  is_current: boolean;
  start_at?: string;
  end_at?: string;
};

export type JobFunction = {
  function: string;
  sub_function: string;
};

export type Company = {
  id: string;
  name: string;
  domain?: string;
  website?: string;
  description?: string;
  year_founded?: number;
  headcount?: number;
  headcount_range?: HeadCountRange;
  company_type?: string;
  locations?: {
    headquarters?: CompanyLocation;
    offices?: OfficeLocation[] | null;
  };
  social_profiles?: SocialProfiles;
  specialties?: string[] | null;
  industry?: {
    main_industry?: string;
  };
  logo_url?: string;
};

export type CompanyLocation = {
  line1?: string;
  line2?: string;
  city?: string;
  region?: string;
  country?: string;
  country_code?: string;
};

export type OfficeLocation = {
  line1?: string;
  line2?: string;
};

export type SocialProfiles = {
  professional_network?: SocialProfile;
};

export type SocialProfile = {
  id?: number;
  url: string;
  handle: string;
  connection_count?: number;
};

export const HEAD_COUNT_RANGES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5001-10000',
  '10001+',
] as const;

export type HeadCountRange = (typeof HEAD_COUNT_RANGES)[number];

// FullEnrich may return no profile at all, so company fields are only sent when
// enrichment actually produced them
export type fullEnrichTwentyCompany = Partial<Omit<twentyCompany, "id">>;

// FullEnrich may return no profile at all, so person fields are only sent when
// enrichment actually produced them
export type fullEnrichTwentyPerson = Partial<Omit<twentyPerson, "id">>;
