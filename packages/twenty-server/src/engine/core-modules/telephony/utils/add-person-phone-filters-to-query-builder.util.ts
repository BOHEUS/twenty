import { type SplitE164PhoneNumber } from 'twenty-shared/utils';

import { type WorkspaceSelectQueryBuilder } from 'src/engine/twenty-orm/query-builder/workspace-select-query-builder';

const stripPlus = (callingCode: string): string => callingCode.replace('+', '');

// The record transformer stores the national significant number and the
// calling code separately, so an E.164 lookup is two equalities on the
// primary phone and a jsonb containment on the additional phones, both of
// which an index can serve. The calling code is accepted with and without
// its plus because the transformer keeps whichever form the writer sent.
export const addPersonPhoneFiltersToQueryBuilder = ({
  queryBuilder,
  phoneNumber: { callingCode, nationalNumber },
}: {
  queryBuilder: WorkspaceSelectQueryBuilder;
  phoneNumber: SplitE164PhoneNumber;
}): WorkspaceSelectQueryBuilder => {
  const callingCodes = [`+${stripPlus(callingCode)}`, stripPlus(callingCode)];

  return queryBuilder.where(
    `(("person"."phonesPrimaryPhoneNumber" = :nationalNumber
        AND "person"."phonesPrimaryPhoneCallingCode" IN (:...callingCodes))
      OR "person"."phonesAdditionalPhones" @> :additionalPhoneWithPlus::jsonb
      OR "person"."phonesAdditionalPhones" @> :additionalPhoneWithoutPlus::jsonb)`,
    {
      nationalNumber,
      callingCodes,
      additionalPhoneWithPlus: JSON.stringify([
        { number: nationalNumber, callingCode: callingCodes[0] },
      ]),
      additionalPhoneWithoutPlus: JSON.stringify([
        { number: nationalNumber, callingCode: callingCodes[1] },
      ]),
    },
  );
};
