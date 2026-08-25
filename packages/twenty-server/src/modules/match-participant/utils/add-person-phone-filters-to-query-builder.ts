import { isDefined } from 'twenty-shared/utils';
import { type SelectQueryBuilder } from 'typeorm';

import { parsePhoneHandle } from 'src/modules/match-participant/utils/parse-phone-handle.util';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export interface AddPersonPhoneFiltersToQueryBuilderOptions {
  queryBuilder: SelectQueryBuilder<PersonWorkspaceEntity>;
  phones: string[];
}

// A query builder rather than find(): a phone is stored split across calling
// code and national number, and matching additional phones needs the jsonb @> operator
export function addPersonPhoneFiltersToQueryBuilder({
  queryBuilder,
  phones,
}: AddPersonPhoneFiltersToQueryBuilderOptions): SelectQueryBuilder<PersonWorkspaceEntity> {
  const parsedPhones = phones.map(parsePhoneHandle).filter(isDefined);

  const conditions = parsedPhones.flatMap((parsedPhone, index) => [
    {
      condition: `("person"."phonesPrimaryPhoneCallingCode" = :callingCode${index} AND "person"."phonesPrimaryPhoneNumber" = :nationalNumber${index})`,
      parameters: {
        [`callingCode${index}`]: parsedPhone.callingCode,
        [`nationalNumber${index}`]: parsedPhone.nationalNumber,
      },
    },
    {
      condition: `"person"."phonesAdditionalPhones" @> :additionalPhone${index}::jsonb`,
      parameters: {
        [`additionalPhone${index}`]: JSON.stringify([
          {
            number: parsedPhone.nationalNumber,
            callingCode: parsedPhone.callingCode,
          },
        ]),
      },
    },
  ]);

  if (conditions.length === 0) {
    // An unparseable handle cannot match a stored phone, and a query builder
    // with no where clause would return every person.
    return queryBuilder.where('1 = 0');
  }

  const [firstCondition, ...otherConditions] = conditions;

  queryBuilder = queryBuilder
    .where(firstCondition.condition, firstCondition.parameters)
    .withDeleted();

  for (const { condition, parameters } of otherConditions) {
    queryBuilder = queryBuilder.orWhere(condition, parameters);
  }

  return queryBuilder;
}
