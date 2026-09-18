import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CognismPersonData } from 'src/logic-functions/types/cognism-person-data';
import { type CompanyMatchKeys } from 'src/logic-functions/types/company-match-keys';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';

export const buildCompanyMatchKeys = (
  personData: CognismPersonData,
): CompanyMatchKeys =>
  pruneUndefined({
    cognismId: toText(personData.account?.id),
    website: normalizeDomain(
      personData.account?.domain ?? personData.account?.website,
    ),
    linkedinUrl: normalizeLinkedinUrl(personData.account?.linkedinUrl),
    name: toText(personData.account?.name),
  });
