import { type CoreApiClient } from 'twenty-client-sdk/core';

import { buildErrorResult } from 'src/logic-functions/utils/build-error-result';
import { buildNotFoundResult } from 'src/logic-functions/utils/build-not-found-result';
import { groupRecordIdsByMatchStatus } from 'src/logic-functions/utils/enrich-chunk/group-record-ids-by-match-status';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type EnrichResult } from 'src/types/enrich-result';
import { type NotFoundRecord } from 'src/types/not-found-record';
import { toErrorMessage } from 'src/utils/to-error-message';

export const recordNotFoundRecords = async <TNode, TData, TInput>({
  adapter,
  client,
  notFoundRecords,
  shouldPersist,
  enrichedAt,
  resultById,
}: {
  adapter: BatchEnrichmentAdapter<TNode, TData, TInput>;
  client: CoreApiClient;
  notFoundRecords: NotFoundRecord[];
  shouldPersist: boolean;
  enrichedAt: string;
  resultById: Map<string, EnrichResult>;
}): Promise<string[]> => {
  if (notFoundRecords.length === 0) {
    return [];
  }

  if (!shouldPersist) {
    for (const notFoundRecord of notFoundRecords) {
      resultById.set(
        notFoundRecord.recordId,
        buildNotFoundResult(notFoundRecord),
      );
    }

    return [];
  }

  // The match status differs per record, so one bulk write per distinct status
  // rather than one per record.
  const groups = groupRecordIdsByMatchStatus(notFoundRecords);

  const settledWriteResults = await Promise.allSettled(
    groups.map(([matchStatus, recordIds]) =>
      adapter.updateManyStatus({
        client,
        recordIds,
        data: {
          zoomInfoEnrichmentStatus: 'NOT_FOUND',
          zoomInfoMatchStatus: matchStatus,
          zoomInfoLastEnrichedAt: enrichedAt,
        },
      }),
    ),
  );

  const failedRecordIds: string[] = [];

  for (const [index, writeResult] of settledWriteResults.entries()) {
    const [matchStatus, recordIds] = groups[index];

    if (writeResult.status === 'rejected') {
      const writeErrorMessage = toErrorMessage(writeResult.reason);

      for (const recordId of recordIds) {
        resultById.set(
          recordId,
          buildErrorResult({ recordId, error: writeErrorMessage }),
        );
        failedRecordIds.push(recordId);
      }
      continue;
    }

    for (const recordId of recordIds) {
      resultById.set(recordId, buildNotFoundResult({ recordId, matchStatus }));
    }
  }

  return failedRecordIds;
};
