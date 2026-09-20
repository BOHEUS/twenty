import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CompanyMatchKeys } from 'src/types/company-match-keys';
import { type RocketReachPersonData } from 'src/types/rocketreach-person-data';
import { isDefined } from 'src/logic-functions/utils/is-defined';
import { pruneUndefined } from 'src/logic-functions/utils/prune-undefined';

export const buildCompanyMatchKeys = (
  personData: RocketReachPersonData,
): CompanyMatchKeys => {
  const employerId = toNumber(personData.current_employer_id);

  return pruneUndefined({
    rocketReachId: isDefined(employerId) ? String(employerId) : undefined,
    domain:
      normalizeDomain(personData.current_employer_domain) ??
      normalizeDomain(personData.current_employer_website),
    linkedinUrl: normalizeLinkedinUrl(
      personData.current_employer_linkedin_url,
    ),
    name: toText(personData.current_employer),
  });
};
