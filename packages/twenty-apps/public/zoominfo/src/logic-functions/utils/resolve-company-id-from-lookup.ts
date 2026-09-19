import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CompanyLookupNode } from 'src/types/company-lookup-node';
import { type CompanyMatchKeys } from 'src/types/company-match-keys';

export type CompanyLookupIndex = {
  byZoomInfoCompanyId: Map<string, string>;
  byWebsite: Map<string, string>;
  byLinkedinUrl: Map<string, string>;
  uniqueByName: Map<string, string>;
};

const AMBIGUOUS = Symbol('ambiguous');

export const buildCompanyLookupIndex = (
  companies: CompanyLookupNode[],
): CompanyLookupIndex => {
  const byZoomInfoCompanyId = new Map<string, string>();
  const byWebsite = new Map<string, string>();
  const byLinkedinUrl = new Map<string, string>();
  const idsByName = new Map<string, string | typeof AMBIGUOUS>();

  for (const company of companies) {
    const zoomInfoCompanyId = toText(company.zoomInfoCompanyId);
    if (isDefined(zoomInfoCompanyId) && !byZoomInfoCompanyId.has(zoomInfoCompanyId)) {
      byZoomInfoCompanyId.set(zoomInfoCompanyId, company.id);
    }

    const website = normalizeDomain(company.domainName?.primaryLinkUrl);
    if (isDefined(website) && !byWebsite.has(website)) {
      byWebsite.set(website, company.id);
    }

    const linkedinUrl = normalizeLinkedinUrl(company.linkedinLink?.primaryLinkUrl);
    if (isDefined(linkedinUrl) && !byLinkedinUrl.has(linkedinUrl)) {
      byLinkedinUrl.set(linkedinUrl, company.id);
    }

    const name = toText(company.name);
    if (isDefined(name)) {
      idsByName.set(name, idsByName.has(name) ? AMBIGUOUS : company.id);
    }
  }

  const uniqueByName = new Map<string, string>();
  for (const [name, companyId] of idsByName) {
    if (companyId !== AMBIGUOUS) {
      uniqueByName.set(name, companyId);
    }
  }

  return { byZoomInfoCompanyId, byWebsite, byLinkedinUrl, uniqueByName };
};

// Same precedence as the per-record lookup: a name only counts when it resolves
// to exactly one company.
export const resolveCompanyIdFromLookup = ({
  matchKeys,
  index,
}: {
  matchKeys: CompanyMatchKeys;
  index: CompanyLookupIndex;
}): string | undefined => {
  const { zoomInfoCompanyId, website, linkedinUrl, name } = matchKeys;

  return (
    (isNonEmptyString(zoomInfoCompanyId)
      ? index.byZoomInfoCompanyId.get(zoomInfoCompanyId)
      : undefined) ??
    (isNonEmptyString(website) ? index.byWebsite.get(website) : undefined) ??
    (isNonEmptyString(linkedinUrl)
      ? index.byLinkedinUrl.get(linkedinUrl)
      : undefined) ??
    (isNonEmptyString(name) ? index.uniqueByName.get(name) : undefined)
  );
};
