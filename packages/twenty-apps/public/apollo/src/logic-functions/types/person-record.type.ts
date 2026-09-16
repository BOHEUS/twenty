export type PersonRecord = {
  id: string;
  name?: { firstName?: string | null; lastName?: string | null } | null;
  emails?: { primaryEmail?: string | null } | null;
  linkedinLink?: { primaryLinkUrl?: string | null } | null;
  company?: { domainName?: { primaryLinkUrl?: string | null } | null } | null;
};
