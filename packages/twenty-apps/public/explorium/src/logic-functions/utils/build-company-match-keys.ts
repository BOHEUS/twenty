import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CompanyMatchKeys } from 'src/types/company-match-keys';
import { type ExploriumPersonData } from 'src/types/explorium-person-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyMatchKeys = (
  personData: ExploriumPersonData,
): CompanyMatchKeys =>
  pruneUndefined({
    website: normalizeDomain(personData.company_website),
    linkedinUrl: normalizeLinkedinUrl(personData.company_linkedin),
    name: toText(personData.company_name),
  });
