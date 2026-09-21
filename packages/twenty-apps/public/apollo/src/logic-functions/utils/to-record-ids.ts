import { isNonEmptyString } from '@sniptt/guards';

import { type RecordInput } from 'src/logic-functions/types/bulk-enrichment-input.type';
import { isDefined } from '../data/is-defined';

export const toRecordIds = (
  records: RecordInput | RecordInput[] | null | undefined,
): string[] => {
  if (!isDefined(records)) {
    return [];
  }

  const recordsAsArray = Array.isArray(records) ? records : [records];

  const recordIds = recordsAsArray
    .map((record) => (typeof record === 'string' ? record : record?.id))
    .filter((recordId): recordId is string => isNonEmptyString(recordId));

  return Array.from(new Set(recordIds));
};
