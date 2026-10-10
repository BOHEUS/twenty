import { mapCompany } from 'src/logic-functions/utils/map-company';
import { type AmplemarketPerson } from 'src/types/amplemarket-person';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyCreateData = (
  person: AmplemarketPerson,
): Record<string, unknown> => {
  if (!isDefined(person.company)) {
    return {};
  }

  const mapped = mapCompany(person.company);

  return pruneUndefined<unknown>({ ...mapped.standard, ...mapped.amplemarket });
};
