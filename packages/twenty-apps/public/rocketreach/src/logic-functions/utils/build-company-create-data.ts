import { buildLinks } from 'src/logic-functions/utils/build-links';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toText } from 'src/logic-functions/utils/to-text';
import { type RocketReachPersonData } from 'src/types/rocketreach-person-data';
import { isDefined } from 'src/logic-functions/utils/is-defined';
import { pruneUndefined } from 'src/logic-functions/utils/prune-undefined';

export const buildCompanyCreateData = (
  personData: RocketReachPersonData,
): Record<string, unknown> => {
  const employerId = toNumber(personData.current_employer_id);

  return pruneUndefined<unknown>({
    name: toText(personData.current_employer),
    domainName: buildLinks({
      url:
        normalizeDomain(personData.current_employer_domain) ??
        normalizeDomain(personData.current_employer_website),
    }),
    linkedinLink: buildLinks({
      url: normalizeLinkedinUrl(personData.current_employer_linkedin_url),
    }),
    rocketReachId: isDefined(employerId) ? String(employerId) : undefined,
    rocketReachIndustry: toText(personData.current_employer_industry),
  });
};
