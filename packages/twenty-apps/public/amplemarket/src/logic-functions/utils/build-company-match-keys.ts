import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { toText } from 'src/logic-functions/utils/to-text';
import { type AmplemarketPerson } from 'src/types/amplemarket-person';
import { type CompanyMatchKeys } from 'src/types/company-match-keys';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyMatchKeys = (
  person: AmplemarketPerson,
): CompanyMatchKeys =>
  pruneUndefined({
    website: normalizeDomain(person.company?.website),
    linkedinUrl: normalizeLinkedinUrl(person.company?.linkedin_url),
    name: toText(person.company?.name),
  });
