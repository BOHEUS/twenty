export type fullEnrichRequest = {
  name: string;
  webhook_url: string;
  data: fullEnrichRequestData[];
}

export type fullEnrichRequestData = {
  first_name: string;
  last_name: string;
  domain: string;
  company_name: string;
  linkedin_url: string;
  enrich_fields: string[];
  custom: fullEnrichCustomProperties;
}

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
  addressPostCode: string;
  addressState: string;
}

export type twentyCompany = {
  id: string;
  name: string;
  domainName: twentyDomainName;
  employees: number | null;
  linkedinLink: twentyDomainName;
  address: twentyAddress;
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

export type twentyPersonPhones = {
  primaryPhoneNumber: string;
  primaryPhoneCallingCode: string;
  additionalPhones: string[] | null;
}

export type twentyPerson = {
  id: string;
  name: twentyPersonName;
  emails: twentyPersonEmail;
  linkedinLink: twentyPersonSocialMedia;
  xLink: twentyPersonSocialMedia;
  jobTitle: string;
  phones: twentyPersonPhones;
  city: string;
  intro: string;
  companyId: string | null;
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
  custom: fullEnrichCustomProperties;
  contact_info: ContactInfo;
  profile: Profile;
};

export type ContactInput = {
  professional_network_url?: string;
  linkedin_url?: string;
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
  status: 'DELIVERABLE' | 'HIGH_PROBABILITY' | 'CATCH_ALL' | 'INVALID';
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
  headline?: string;
  description?: string;
  location?: Location;
  social_profiles?: SocialProfiles;
  educations?: Education[];
  languages?: Language[];
  skills?: string[];
  employment?: Employment;
};

export type Location = {
  country?: string;
  country_code?: string;
  city?: string;
  region?: string;
};

export type Education = {
  school_name: string;
  degree?: string;
  start_at?: string;
  end_at?: string;
};

export type Language = {
  language: string;
  proficiency?: string;
};

export type Employment = {
  current?: JobPosition;
  all?: JobPosition[];
};

export type JobPosition = {
  title: string;
  description?: string;
  company: Company;
  is_current: boolean;
  start_at?: string;
  end_at?: string;
};

export type Company = {
  id: string;
  name: string;
  domain?: string;
  website?: string;
  description?: string;
  year_founded?: number;
  headcount?: number;
  headcount_range?: string;
  company_type?: string;
  locations?: {
    headquarters?: CompanyLocation;
    offices?: CompanyLocation[] | null;
  };
  social_profiles?: SocialProfiles;
  specialties?: string | null;
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

export type SocialProfiles = {
  professional_network?: SocialProfile;
  linkedin?: SocialProfile;
};

export type SocialProfile = {
  id?: number;
  url: string;
  handle: string;
  connection_count?: number;
};
