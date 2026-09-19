import { type CoreApiClient } from 'twenty-client-sdk/core';

import { buildErrorResult } from 'src/logic-functions/utils/build-error-result';
import { buildMatchedResult } from 'src/logic-functions/utils/build-matched-result';
import { INTERNAL_BOOKKEEPING_FIELDS } from 'src/logic-functions/utils/internal-bookkeeping-fields';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type EnrichResult } from 'src/types/enrich-result';
import { type MatchedRecord } from 'src/types/matched-record';
import { toErrorMessage } from 'src/utils/to-error-message';

export const recordMatchedRecords = async <TNode, TData, TInput>({
  adapter,
  client,
  matchedRecords,
  shouldPersist,
  resultById,
}: {
  adapter: BatchEnrichmentAdapter<TNode, TData, TInput>;
  client: CoreApiClient;
  matchedRecords: MatchedRecord[];
  shouldPersist: boolean;
  resultById: Map<string, EnrichResult>;
}): Promise<string[]> => {
  if (matchedRecords.length === 0) {
    return [];
  }

  if (!shouldPersist) {
    for (const matchedRecord of matchedRecords) {
      resultById.set(
        matchedRecord.recordId,
        buildMatchedResult({
          recordId: matchedRecord.recordId,
          updatedFields: [],
          data: matchedRecord.mappedData,
        }),
      );
    }

    return [];
  }

  const settledWriteResults = await Promise.allSettled(
    matchedRecords.map((matchedRecord) =>
      adapter.updateOne({
        client,
        recordId: matchedRecord.recordId,
        data: matchedRecord.persistData,
      }),
    ),
  );

  const failedRecordIds: string[] = [];

  for (const [index, writeResult] of settledWriteResults.entries()) {
    const matchedRecord = matchedRecords[index];

    if (writeResult.status === 'rejected') {
      resultById.set(
        matchedRecord.recordId,
        buildErrorResult({
          recordId: matchedRecord.recordId,
          error: toErrorMessage(writeResult.reason),
        }),
      );
      failedRecordIds.push(matchedRecord.recordId);
      continue;
    }

    resultById.set(
      matchedRecord.recordId,
      buildMatchedResult({
        recordId: matchedRecord.recordId,
        updatedFields: Object.keys(matchedRecord.persistData).filter(
          (fieldName) => !INTERNAL_BOOKKEEPING_FIELDS.has(fieldName),
        ),
        data: matchedRecord.mappedData,
      }),
    );
  }

  return failedRecordIds;
};
