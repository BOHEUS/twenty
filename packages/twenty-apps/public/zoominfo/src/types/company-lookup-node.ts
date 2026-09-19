export type CompanyLookupNode = {
  id: string;
  name?: string | null;
  domainName?: { primaryLinkUrl?: string | null } | null;
  linkedinLink?: { primaryLinkUrl?: string | null } | null;
  zoomInfoCompanyId?: string | null;
};
