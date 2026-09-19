import { isNonEmptyString } from '@sniptt/guards';

import { type RecordInput } from 'src/types/bulk-enrich-input';
import { isDefined } from 'src/utils/is-defined';

export const extractRecordIds = (
  records: RecordInput | RecordInput[],
): string[] => {
  const recordsAsArray = !isDefined(records)
    ? []
    : Array.isArray(records)
      ? records
      : [records];

  return recordsAsArray
    .map((record) => (typeof record === 'string' ? record : record?.id))
    .filter((id): id is string => isNonEmptyString(id));
};
