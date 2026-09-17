import { isDefined } from 'twenty-sdk/utils';

import { normalizeDomain } from 'src/logic-functions/data/normalize-domain';
import { toText } from 'src/logic-functions/data/to-text';
import { type CompanyRecord } from 'src/logic-functions/types/company-record.type';
import { type LushaCompanySearchItem } from 'src/logic-functions/types/lusha-search-item.type';

// Lusha can also match on a name alone, but a bare name picks the most popular
// company carrying it, and writing that company's domain onto the record would
// corrupt the key every later match relies on.
export const buildCompanySearchItem = (
  company: CompanyRecord,
): LushaCompanySearchItem | undefined => {
  const lushaId = toText(company.lushaId);

  if (isDefined(lushaId)) {
    return { clientReferenceId: company.id, id: lushaId };
  }

  const domain = normalizeDomain(company.domainName?.primaryLinkUrl);

  return isDefined(domain)
    ? { clientReferenceId: company.id, domain }
    : undefined;
};
