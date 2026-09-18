import { buildLinks } from 'src/logic-functions/utils/build-links';
import { type CompanyMatchKeys } from 'src/logic-functions/types/company-match-keys';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';

export const buildCompanyCreateData = (
  matchKeys: CompanyMatchKeys,
): Record<string, unknown> =>
  pruneUndefined<unknown>({
    name: matchKeys.name,
    domainName: buildLinks({ url: matchKeys.website }),
    linkedinLink: buildLinks({ url: matchKeys.linkedinUrl }),
    cognismId: matchKeys.cognismId,
  });
