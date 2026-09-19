export type CompanyEnrichParams =
  | { identifierType: 'domains'; identifier: string }
  | { identifierType: 'professional_network_profile_urls'; identifier: string }
  | { identifierType: 'crustdata_company_ids'; identifier: string }
  | { identifierType: 'names'; identifier: string };
