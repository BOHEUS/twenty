// Every item carries the Twenty record id as clientReferenceId, which Lusha
// echoes back on the matching result.
export type LushaContactSearchItem = {
  clientReferenceId: string;
  id?: string;
  linkedinUrl?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  companyDomain?: string;
};

export type LushaCompanySearchItem = {
  clientReferenceId: string;
  id?: string;
  domain?: string;
};
