import { buildCompanyMatchKeys } from 'src/logic-functions/utils/build-company-match-keys';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { mapCompany } from 'src/logic-functions/utils/map-company';
import { type HunterPersonData } from 'src/types/hunter-person-data';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyCreateData = (
  personData: HunterPersonData,
): Record<string, unknown> => {
  const matchKeys = buildCompanyMatchKeys(personData);
  const mapped = isDefined(personData.company)
    ? mapCompany(personData.company)
    : { standard: {}, hunter: {} };

  return pruneUndefined<unknown>({
    name: matchKeys.name,
    domainName: buildLinks({ url: matchKeys.website }),
    ...mapped.standard,
    ...mapped.hunter,
  });
};
