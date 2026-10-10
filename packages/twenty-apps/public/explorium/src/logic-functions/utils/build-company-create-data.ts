import { buildLinks } from 'src/logic-functions/utils/build-links';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { toText } from 'src/logic-functions/utils/to-text';
import { type ExploriumPersonData } from 'src/types/explorium-person-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyCreateData = (
  personData: ExploriumPersonData,
): Record<string, unknown> =>
  pruneUndefined<unknown>({
    name: toText(personData.company_name),
    domainName: buildLinks({
      url: normalizeDomain(personData.company_website),
    }),
    linkedinLink: buildLinks({
      url: normalizeLinkedinUrl(personData.company_linkedin),
    }),
  });
