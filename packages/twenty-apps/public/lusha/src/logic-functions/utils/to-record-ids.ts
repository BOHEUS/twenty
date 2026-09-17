import { isNonEmptyString, isString } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { type RecordInput } from 'src/logic-functions/types/bulk-enrichment-input.type';

// A record selection and an AI tool call send ids, but a workflow step sends
// whatever its variable resolved to: record objects, or a single record.
export const toRecordIds = (
  records: RecordInput | RecordInput[] | null | undefined,
): string[] => {
  if (!isDefined(records)) {
    return [];
  }

  const recordIds = (Array.isArray(records) ? records : [records])
    .map((record) => (isString(record) ? record : record?.id)?.trim())
    .filter((recordId): recordId is string => isNonEmptyString(recordId));

  return Array.from(new Set(recordIds));
};
