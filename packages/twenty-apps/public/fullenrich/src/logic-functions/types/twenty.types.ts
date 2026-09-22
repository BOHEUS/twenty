import {
  type FullEnrichEducation,
  type FullEnrichJobPosition,
  type FullEnrichLanguage,
  type FullEnrichOfficeAddress,
} from 'src/logic-functions/types/fullenrich.types';

export type TwentyLinks = {
  primaryLinkLabel: string;
  primaryLinkUrl: string;
};

export type TwentyAddress = {
  addressStreet1: string;
  addressStreet2: string;
  addressCity: string;
  addressState: string;
  addressPostcode: string;
  addressCountry: string;
};

export const HEADCOUNT_RANGES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5001-10000',
  '10001+',
] as const;

export type HeadcountRange = (typeof HEADCOUNT_RANGES)[number];

export const COMPANY_TYPES = [
  'PRIVATELY_HELD',
  'PUBLIC_COMPANY',
  'PARTNERSHIP',
  'NONPROFIT',
  'EDUCATIONAL',
  'GOVERNMENT_AGENCY',
  'SELF_OWNED',
  'SELF_EMPLOYED',
] as const;

export type CompanyType = (typeof COMPANY_TYPES)[number];

export const SENIORITIES = [
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

export type Seniority = (typeof SENIORITIES)[number];

// Standard Twenty fields first, then the fields this app adds. App fields carry
// a fullEnrich prefix so they cannot collide with another enrichment app's.
export type TwentyCompany = {
  id: string;
  name: string;
  domainName: TwentyLinks;
  linkedinLink: TwentyLinks;
  address: TwentyAddress;
  fullEnrichDescription: string | null;
  fullEnrichYearFounded: number | null;
  fullEnrichHeadcount: number | null;
  fullEnrichHeadcountRange: HeadcountRange | null;
  fullEnrichCompanyType: CompanyType | null;
  fullEnrichIndustry: string | null;
  fullEnrichSpecialties: string[] | null;
  fullEnrichLogo: TwentyLinks | null;
  fullEnrichOfficeLocations: FullEnrichOfficeAddress[] | null;
  fullEnrichLinkedinFollowerCount: number | null;
  fullEnrichCompanyId: string | null;
  fullEnrichEnrichedAt: string | null;
};

export type TwentyEmails = {
  primaryEmail: string;
  additionalEmails: string[] | null;
};

export type TwentyAdditionalPhone = {
  number: string;
  callingCode: string;
  countryCode: string;
};

export type TwentyPhones = {
  primaryPhoneNumber: string;
  primaryPhoneCallingCode: string;
  primaryPhoneCountryCode: string;
  additionalPhones: TwentyAdditionalPhone[] | null;
};

export type TwentyPerson = {
  id: string;
  name: {
    firstName: string;
    lastName: string;
  };
  emails: TwentyEmails;
  phones: TwentyPhones;
  linkedinLink: TwentyLinks;
  jobTitle: string;
  companyId: string | null;
  fullEnrichHeadline: string | null;
  fullEnrichAbout: string | null;
  fullEnrichLocation: TwentyAddress | null;
  fullEnrichSkills: string[] | null;
  fullEnrichLanguages: FullEnrichLanguage[] | null;
  fullEnrichEducations: FullEnrichEducation[] | null;
  fullEnrichSeniority: Seniority | null;
  fullEnrichJobFunction: string | null;
  fullEnrichJobSubFunction: string | null;
  fullEnrichEmploymentHistory: FullEnrichJobPosition[] | null;
  fullEnrichCurrentRoleStartedAt: string | null;
  fullEnrichLinkedinConnectionCount: number | null;
  fullEnrichPersonId: string | null;
  fullEnrichEnrichedAt: string | null;
};

export type TwentyCompanyUpdate = Partial<Omit<TwentyCompany, 'id'>>;

export type TwentyPersonUpdate = Partial<Omit<TwentyPerson, 'id'>>;
