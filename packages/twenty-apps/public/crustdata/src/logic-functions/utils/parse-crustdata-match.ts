import { isArray, isNumber, isObject } from '@sniptt/guards';

import { toIdText } from 'src/logic-functions/utils/to-id-text';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CrustdataEnrichResult } from 'src/types/crustdata-enrich-result';
import { isDefined } from 'src/utils/is-defined';
import { isRecord } from 'src/utils/is-record';

// Every enrich endpoint answers with one entry per submitted identifier: a match status plus a
// `matches` array ordered by confidence. `redacted` means the person asked Crustdata to remove
// their data, so retrying will never match.
export const parseCrustdataItem = <TData>({
  item,
  httpStatus,
  dataKey,
}: {
  item: unknown;
  httpStatus: number;
  dataKey: 'person_data' | 'company_data';
}): CrustdataEnrichResult<TData> => {
  if (!isRecord(item)) {
    return {
      outcome: 'error',
      httpStatus,
      message: 'Crustdata returned an unreadable result for this record.',
    };
  }

  if (toText(item.match_status) === 'redacted') {
    return { outcome: 'redacted', httpStatus };
  }

  const bestMatch = isArray(item.matches) ? item.matches[0] : undefined;

  if (!isRecord(bestMatch)) {
    return { outcome: 'not_found', httpStatus };
  }

  const data = bestMatch[dataKey];

  if (!isObject(data)) {
    return { outcome: 'not_found', httpStatus };
  }

  return {
    outcome: 'matched',
    httpStatus,
    confidenceScore: isNumber(bestMatch.confidence_score)
      ? bestMatch.confidence_score
      : undefined,
    // The payload shape is the caller's contract with Crustdata; JSON gives no more than `object`.
    data: data as TData,
  };
};

export const indexResultsByMatchedOn = (json: unknown): Map<string, unknown> => {
  const items = isArray(json) ? json : [];
  const resultByMatchedOn = new Map<string, unknown>();

  for (const item of items) {
    if (!isRecord(item)) {
      continue;
    }

    // Crustdata echoes the identifier it matched; for crustdata_company_ids that is a number.
    const matchedOn = toIdText(item.matched_on);

    if (isDefined(matchedOn)) {
      resultByMatchedOn.set(matchedOn.toLowerCase(), item);
    }
  }

  return resultByMatchedOn;
};
