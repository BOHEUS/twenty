type fullEnrichRequestData = {
  firstname: string;
  lastname: string;
  domain: string;
  company_name: string;
  linkedin_url: string;
  enrich_fields: string[];
  custom: object;
}

type fullEnrichRequest = {
  name: string;
  webhook_url: string;
  datas: fullEnrichRequestData[];
}

type fullEnrichPersonEmails = {
  email: string;
  status: string;
}

type fullEnrichPersonPhoneNumber = {
  number: string;
  region: string;
}

type fullEnrichPersonSocialMedia = {
  url: string;
  type: string;
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

type fullEnrichCompany = {
  linkedin_url: string;
  name: string;
  website: string;
  headcount: number;
  headquarters: fullEnrichCompanyAddress;
}

type fullEnrichPersonLinkedinProfilePosition = {
  title: string;
  company: fullEnrichCompany;
}

type fullEnrichPersonLinkedinProfile = {
  linkedin_url: string;
  linkedin_handle: string;
  location: string;
  summary: string;
  position: fullEnrichPersonLinkedinProfilePosition;
}

type fullEnrichPerson = {
  firstname: string;
  lastname: string;
  most_probable_email: string;
  most_probable_email_status: string;
  most_probable_phone: string;
  emails: fullEnrichPersonEmails[];
  phones: fullEnrichPersonPhoneNumber[];
  social_medias: fullEnrichPersonSocialMedia[];
  profile: fullEnrichPersonLinkedinProfile;
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
  id?: string;
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
  id?: string;
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

export {fullEnrichRequest, fullEnrichPerson, twentyCompany, twentyPerson, twentyPersonSocialMedia, twentyPersonPhones};