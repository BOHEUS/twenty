// Application and server variables reach a logic function as process.env
// entries keyed by the exact name declared in application-config.ts
export const FULLENRICH_API_KEY_VARIABLE = 'FULLENRICH_API_KEY';

// The instance-wide key, used when a workspace has not set its own. It cannot
// share a name with the application variable: application variables are
// injected even when empty and take precedence, so an unset workspace key
// would blank out the server value instead of falling through to it.
export const FULLENRICH_ADMIN_API_KEY_SERVER_VARIABLE =
  'FULLENRICH_ADMIN_API_KEY';
export const FULLENRICH_DATA_REQUIREMENTS_VARIABLE =
  'FULLENRICH_DATA_REQUIREMENTS';
export const FULLENRICH_REQUEST_CONSTRAINTS_VARIABLE =
  'FULLENRICH_REQUEST_CONSTRAINTS';

export const FULLENRICH_ENRICH_FIELDS = [
  'contact.work_emails',
  'contact.personal_emails',
  'contact.phones',
] as const;

export type FullEnrichEnrichField = (typeof FULLENRICH_ENRICH_FIELDS)[number];

export const DEFAULT_ENRICH_FIELDS: FullEnrichEnrichField[] = [
  'contact.work_emails',
];

export const PERSON_REQUEST_CONSTRAINTS = [
  'person.email',
  'person.phones',
  'person.location',
  'person.about',
  'person.jobTitle',
] as const;

export type PersonRequestConstraint =
  (typeof PERSON_REQUEST_CONSTRAINTS)[number];

export const COMPANY_REQUEST_CONSTRAINTS = [
  'company.headcount',
  'company.address',
] as const;

export type CompanyRequestConstraint =
  (typeof COMPANY_REQUEST_CONSTRAINTS)[number];

export type RequestConstraint =
  | PersonRequestConstraint
  | CompanyRequestConstraint;
