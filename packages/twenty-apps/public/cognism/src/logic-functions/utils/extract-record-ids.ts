import { isArray, isNonEmptyString, isString } from '@sniptt/guards';

import { type RecordInput } from 'src/logic-functions/types/bulk-enrich-input';
import { isDefined } from 'src/logic-functions/data/is-defined';

export const extractRecordIds = (
  records: RecordInput | RecordInput[],
): string[] => {
  const recordsAsArray = !isDefined(records)
    ? []
    : isArray(records)
      ? records
      : [records];

  return recordsAsArray
    .map((record) => (isString(record) ? record : record?.id))
    .filter((id): id is string => isNonEmptyString(id));
};
