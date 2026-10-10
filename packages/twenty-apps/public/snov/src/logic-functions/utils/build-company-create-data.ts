import { buildLinks } from 'src/logic-functions/utils/build-links';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { toCurrentEmployer } from 'src/logic-functions/utils/to-current-employer';
import { type SnovPersonData } from 'src/types/snov-person-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyCreateData = (
  personData: SnovPersonData,
): Record<string, unknown> => {
  const currentEmployer = toCurrentEmployer(personData);

  return pruneUndefined<unknown>({
    name: currentEmployer.name,
    domainName: buildLinks({ url: normalizeDomain(currentEmployer.website) }),
    linkedinLink: buildLinks({
      url: normalizeLinkedinUrl(currentEmployer.linkedinUrl),
    }),
  });
};
