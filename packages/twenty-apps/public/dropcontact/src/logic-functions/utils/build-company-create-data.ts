import { mapCompany } from 'src/logic-functions/utils/map-company';
import { toText } from 'src/logic-functions/utils/to-text';
import { type DropcontactPersonData } from 'src/types/dropcontact-person-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyCreateData = (
  personData: DropcontactPersonData,
): Record<string, unknown> => {
  const mapped = mapCompany(personData);

  return pruneUndefined<unknown>({
    name: toText(personData.company),
    ...mapped.standard,
    ...mapped.dropcontact,
  });
};
