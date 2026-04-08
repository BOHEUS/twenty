type fullEnrichRequest = {
  name: string;
  webhook_url: string;
  datas: fullEnrichRequestData[];
}

type fullEnrichRequestData = {
  firstname: string;
  lastname: string;
  domain: string;
  company_name: string;
  linkedin_url: string;
  enrich_fields: string[];
  custom: fullEnrichCustomProperties;
}

type fullEnrichCustomProperties = {
  companyId: string;
  personId: string;
}

type fullEnrichWebhookResponse = {
  id: string;
  name: string;
  status: string;
  data: {input: (fullEnrichPerson & {custom: fullEnrichCustomProperties})}[];
}

type fullEnrichPerson = {
  firstname: string;
  lastname: string;
  most_probable_email: fullEnrichPersonEmails;
  most_probable_phone: fullEnrichPersonPhoneNumber;
  work_emails: fullEnrichPersonEmails[];
  phones: fullEnrichPersonPhoneNumber[];
  profile: fullEnrichPersonLinkedinProfile;
}

type fullEnrichPersonEmails = {
  email: string;
  status: string;
}

type fullEnrichPersonPhoneNumber = {
  number: string;
  region: string;
}

type fullEnrichPersonLinkedinProfile = {
  linkedin_url: string;
  linkedin_handle: string;
  location: string;
  summary: string;
  position: fullEnrichPersonLinkedinProfilePosition;
  social_medias: fullEnrichPersonSocialMedia[];
};

type fullEnrichPersonSocialMedia = {
  url: string;
  type: string;
}

type fullEnrichPersonLinkedinProfilePosition = {
  title: string;
  company: fullEnrichCompany;
}

type fullEnrichCompany = {
  linkedin_url: string;
  name: string;
  website: string;
  headcount: number;
  headquarters: fullEnrichCompanyAddress;
}

type fullEnrichCompanyAddress = {
  region: string;
  city: string;
  country: string;
  countryCode: string;
  postalCode: string;
  address_line_1: string;
  address_line_2: string;
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

type twentyCompany = {
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

type twentyPersonSocialMedia = {
  primaryLinkLabel: string;
  primaryLinkUrl: string;
}

type twentyPersonEmail = {
  primaryEmail: string;
  additionalEmails: string[] | null;
}

type twentyPersonPhones = {
  primaryPhoneNumber: string;
  primaryPhoneCallingCode: string;
  additionalPhones: string[] | null;
}

type twentyPerson = {
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
  status: "FINISHED" | "PENDING" | "FAILED";
  data: ContactData[];
};

export type ContactData = {
  input: ContactInput;
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
  status: "DELIVERABLE" | "INVALID" | "UNVERIFIED";
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
  location?: Location;
  employment?: Employment;
  social_profiles?: SocialProfiles;
};

export type Location = {
  country?: string;
  country_code?: string;
  city?: string;
};

export type Employment = {
  current?: JobPosition;
  previous?: JobPosition[];
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
  description?: string;
  year_founded?: number;
  headcount?: number;
  headcount_range?: string;
  company_type?: string;
  locations?: {
    headquarters?: Record<string, any>;
    offices?: Record<string, any> | null;
  };
  social_profiles?: SocialProfiles;
  specialties?: string | null;
  industry?: {
    main_industry?: string;
  };
};

export type SocialProfiles = {
  professional_network?: SocialProfile;
  linkedin?: SocialProfile;
};

export type SocialProfile = {
  id: number;
  url: string;
  handle: string;
};

export {fullEnrichRequest, fullEnrichPerson, twentyCompany, twentyPerson, twentyPersonSocialMedia, twentyPersonPhones, fullEnrichWebhookResponse};