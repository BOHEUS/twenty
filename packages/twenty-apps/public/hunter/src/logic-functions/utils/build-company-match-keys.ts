import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CompanyMatchKeys } from 'src/types/company-match-keys';
import { type HunterPersonData } from 'src/types/hunter-person-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyMatchKeys = ({
  person,
  company,
  emailFinder,
}: HunterPersonData): CompanyMatchKeys =>
  pruneUndefined({
    website: normalizeDomain(company?.domain ?? person?.employment?.domain),
    name:
      toText(company?.name) ??
      toText(person?.employment?.name) ??
      toText(emailFinder?.company),
  });
