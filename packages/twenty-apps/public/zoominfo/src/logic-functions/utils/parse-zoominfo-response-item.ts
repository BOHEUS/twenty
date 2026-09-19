import { isNonEmptyString } from '@sniptt/guards';

import { toText } from 'src/logic-functions/utils/to-text';
import { type ZoomInfoEnrichResult } from 'src/types/zoominfo-enrich-result';
import { isRecord } from 'src/utils/is-record';

const UNKNOWN_MATCH_STATUS = 'UNKNOWN';

// FULL_MATCH is the only status that carries both contact and company data, but
// the partial matches carry the half they did resolve and are worth keeping.
const MATCHED_STATUSES = new Set([
  'FULL_MATCH',
  'CONTACT_ONLY_MATCH',
  'COMPANY_ONLY_MATCH',
]);

// These describe a broken request rather than an absent record, so retrying the
// same input unchanged will fail the same way.
const ERROR_STATUSES = new Set(['LIMIT_EXCEEDED', 'INVALID_INPUT']);

const NO_MATCH_RECORD_ID = '0';

export const parseZoomInfoResponseItem = <TData>(
  responseItem: unknown,
): ZoomInfoEnrichResult<TData> => {
  if (!isRecord(responseItem)) {
    return {
      outcome: 'error',
      message: 'ZoomInfo returned no response for this record.',
    };
  }

  const matchStatus = isRecord(responseItem.meta)
    ? (toText(responseItem.meta.matchStatus) ?? UNKNOWN_MATCH_STATUS)
    : UNKNOWN_MATCH_STATUS;

  if (ERROR_STATUSES.has(matchStatus)) {
    return {
      outcome: 'error',
      matchStatus,
      message: `ZoomInfo returned ${matchStatus} for this record.`,
    };
  }

  if (!MATCHED_STATUSES.has(matchStatus) || !isRecord(responseItem.attributes)) {
    return { outcome: 'not_found', matchStatus };
  }

  const recordId = toText(responseItem.id);

  return {
    outcome: 'matched',
    matchStatus,
    data: {
      ...responseItem.attributes,
      ...(isNonEmptyString(recordId) && recordId !== NO_MATCH_RECORD_ID
        ? { id: recordId }
        : {}),
    } as TData,
  };
};
