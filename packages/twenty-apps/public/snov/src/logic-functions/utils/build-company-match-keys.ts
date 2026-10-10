import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { toCurrentEmployer } from 'src/logic-functions/utils/to-current-employer';
import { type CompanyMatchKeys } from 'src/types/company-match-keys';
import { type SnovPersonData } from 'src/types/snov-person-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyMatchKeys = (
  personData: SnovPersonData,
): CompanyMatchKeys => {
  const currentEmployer = toCurrentEmployer(personData);

  return pruneUndefined({
    website: normalizeDomain(currentEmployer.website),
    linkedinUrl: normalizeLinkedinUrl(currentEmployer.linkedinUrl),
    name: currentEmployer.name,
  });
};
