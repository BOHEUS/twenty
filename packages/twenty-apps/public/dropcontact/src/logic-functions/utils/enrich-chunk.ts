import { type CoreApiClient } from 'twenty-client-sdk/core';

import { DROPCONTACT_ACCESS_ERROR_MESSAGE } from 'src/constants/dropcontact-access-error-message';
import { DropcontactConfigError } from 'src/logic-functions/errors/dropcontact-config-error';
import { buildErrorResult } from 'src/logic-functions/utils/build-error-result';
import { buildMatchedResult } from 'src/logic-functions/utils/build-matched-result';
import { buildNotFoundResult } from 'src/logic-functions/utils/build-not-found-result';
import { buildPendingResult } from 'src/logic-functions/utils/build-pending-result';
import { buildSkippedResult } from 'src/logic-functions/utils/build-skipped-result';
import { INTERNAL_BOOKKEEPING_FIELDS } from 'src/logic-functions/utils/internal-field-names';
import { isDropcontactAccountErrorOutcome } from 'src/logic-functions/utils/is-dropcontact-account-error-outcome';
import { nowIso } from 'src/logic-functions/utils/now-iso';
import { resolveUpdateFieldsMode } from 'src/logic-functions/utils/resolve-update-fields-mode';
import { toDropcontactOutcomeErrorMessage } from 'src/logic-functions/utils/to-dropcontact-outcome-error-message';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type BulkEnrichInput } from 'src/types/bulk-enrich-input';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type EnrichChunkResult } from 'src/types/enrich-chunk-result';
import { type EnrichResult } from 'src/types/enrich-result';
import { type DropcontactEnrichResult } from 'src/types/dropcontact-enrich-result';
import { isDefined } from 'src/utils/is-defined';
import { toErrorMessage } from 'src/utils/to-error-message';

const writeErrorStatusWithBackoff = async <TNode, TData, TParams>({
  adapter,
  client,
  recordIds,
  enrichedAt,
  shouldClearRequestId,
}: {
  adapter: BatchEnrichmentAdapter<TNode, TData, TParams>;
  client: CoreApiClient;
  recordIds: string[];
  enrichedAt: string;
  shouldClearRequestId: boolean;
}): Promise<void> => {
  if (recordIds.length === 0) {
    return;
  }

  await adapter
    .updateManyStatus({
      client,
      recordIds,
      data: {
        dropcontactEnrichmentStatus: 'ERROR',
        dropcontactLastEnrichedAt: enrichedAt,
        ...(shouldClearRequestId ? { dropcontactRequestId: null } : {}),
      },
    })
    .catch(() => undefined);
};

const recordPendingRecords = async <TNode, TData, TParams>({
  adapter,
  client,
  pendingRecords,
  shouldPersist,
  resultById,
}: {
  adapter: BatchEnrichmentAdapter<TNode, TData, TParams>;
  client: CoreApiClient;
  pendingRecords: { recordId: string; requestId: string }[];
  shouldPersist: boolean;
  resultById: Map<string, EnrichResult>;
}): Promise<void> => {
  if (!shouldPersist) {
    for (const { recordId } of pendingRecords) {
      resultById.set(
        recordId,
        buildPendingResult({ recordId, isRequestIdStored: false }),
      );
    }

    return;
  }

  const recordIdsByRequestId = new Map<string, string[]>();
  for (const { recordId, requestId } of pendingRecords) {
    recordIdsByRequestId.set(requestId, [
      ...(recordIdsByRequestId.get(requestId) ?? []),
      recordId,
    ]);
  }

  for (const [requestId, recordIds] of recordIdsByRequestId) {
    try {
      await adapter.updateManyStatus({
        client,
        recordIds,
        data: {
          dropcontactEnrichmentStatus: 'PENDING',
          dropcontactRequestId: requestId,
        },
      });
      for (const recordId of recordIds) {
        resultById.set(
          recordId,
          buildPendingResult({ recordId, isRequestIdStored: true }),
        );
      }
    } catch (pendingStatusWriteError) {
      for (const recordId of recordIds) {
        resultById.set(
          recordId,
          buildErrorResult({
            recordId,
            error: toErrorMessage(pendingStatusWriteError),
          }),
        );
      }
    }
  }
};

type MatchedRecord = {
  recordId: string;
  mappedData: Record<string, unknown>;
  persistData: Record<string, unknown>;
};

const recordMatchedRecords = async <TNode, TData, TParams>({
  adapter,
  client,
  matchedRecords,
  shouldPersist,
  resultById,
}: {
  adapter: BatchEnrichmentAdapter<TNode, TData, TParams>;
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

const recordNotFoundRecords = async <TNode, TData, TParams>({
  adapter,
  client,
  notFoundRecordIds,
  shouldPersist,
  enrichedAt,
  resultById,
}: {
  adapter: BatchEnrichmentAdapter<TNode, TData, TParams>;
  client: CoreApiClient;
  notFoundRecordIds: string[];
  shouldPersist: boolean;
  enrichedAt: string;
  resultById: Map<string, EnrichResult>;
}): Promise<string[]> => {
  if (notFoundRecordIds.length === 0) {
    return [];
  }

  if (!shouldPersist) {
    for (const recordId of notFoundRecordIds) {
      resultById.set(recordId, buildNotFoundResult(recordId));
    }

    return [];
  }

  try {
    await adapter.updateManyStatus({
      client,
      recordIds: notFoundRecordIds,
      data: {
        dropcontactEnrichmentStatus: 'NOT_FOUND',
        dropcontactLastEnrichedAt: enrichedAt,
        dropcontactRequestId: null,
      },
    });
    for (const recordId of notFoundRecordIds) {
      resultById.set(recordId, buildNotFoundResult(recordId));
    }

    return [];
  } catch (notFoundStatusWriteError) {
    const notFoundStatusWriteErrorMessage = toErrorMessage(
      notFoundStatusWriteError,
    );
    for (const recordId of notFoundRecordIds) {
      resultById.set(
        recordId,
        buildErrorResult({ recordId, error: notFoundStatusWriteErrorMessage }),
      );
    }

    return notFoundRecordIds;
  }
};

export const enrichChunk = async <TNode, TData, TParams>({
  client,
  recordIds,
  input,
  adapter,
  resultById,
  companyIdByMatchKeyCache,
  deadline,
}: {
  client: CoreApiClient;
  recordIds: string[];
  input: BulkEnrichInput;
  adapter: BatchEnrichmentAdapter<TNode, TData, TParams>;
  resultById: Map<string, EnrichResult>;
  companyIdByMatchKeyCache: CompanyIdByMatchKeyCache;
  deadline: number;
}): Promise<EnrichChunkResult> => {
  const { shouldPersist, overrideExistingValues } = resolveUpdateFieldsMode(
    input.updateFields,
  );

  let recordNodes: TNode[];
  try {
    recordNodes = await adapter.readRecords({ client, recordIds });
  } catch (readError) {
    const readErrorMessage = toErrorMessage(readError);
    for (const recordId of recordIds) {
      resultById.set(
        recordId,
        buildErrorResult({ recordId, error: readErrorMessage }),
      );
    }

    return {};
  }

  const nodeByRecordId = new Map(
    recordNodes.map((recordNode) => [
      adapter.getNodeId(recordNode),
      recordNode,
    ]),
  );

  const recordsToEnrich: { recordId: string; node: TNode; params: TParams }[] =
    [];
  for (const recordId of recordIds) {
    const recordNode = nodeByRecordId.get(recordId);
    if (!isDefined(recordNode)) {
      resultById.set(
        recordId,
        buildErrorResult({
          recordId,
          error: `${adapter.objectNameSingular} ${recordId} not found`,
        }),
      );
      continue;
    }

    const matchParams = adapter.extractParams({ node: recordNode });
    if (!isDefined(matchParams)) {
      resultById.set(
        recordId,
        buildSkippedResult({
          recordId,
          message: adapter.noIdentifierMessage,
        }),
      );
      continue;
    }

    recordsToEnrich.push({ recordId, node: recordNode, params: matchParams });
  }

  if (recordsToEnrich.length === 0) {
    return {};
  }

  const enrichedAt = nowIso();
  const recordIdsToMarkAsError: string[] = [];
  const outcomeErrorRecordIds: string[] = [];
  const pendingRecords: { recordId: string; requestId: string }[] = [];

  let dropcontactEnrichmentOutcomes: DropcontactEnrichResult<TData>[];
  try {
    dropcontactEnrichmentOutcomes = await adapter.enrichBatch(
      recordsToEnrich.map((recordToEnrich) => recordToEnrich.params),
      { deadline },
    );
  } catch (enrichBatchError) {
    const isDropcontactConfigError =
      enrichBatchError instanceof DropcontactConfigError;
    const enrichBatchErrorMessage = isDropcontactConfigError
      ? DROPCONTACT_ACCESS_ERROR_MESSAGE
      : toErrorMessage(enrichBatchError);
    for (const recordToEnrich of recordsToEnrich) {
      resultById.set(
        recordToEnrich.recordId,
        buildErrorResult({
          recordId: recordToEnrich.recordId,
          error: enrichBatchErrorMessage,
        }),
      );
    }
    if (shouldPersist) {
      await writeErrorStatusWithBackoff({
        adapter,
        client,
        recordIds: recordsToEnrich.map(
          (recordToEnrich) => recordToEnrich.recordId,
        ),
        enrichedAt,
        shouldClearRequestId: false,
      });
    }

    return isDropcontactConfigError
      ? { dropcontactAccessErrorMessage: enrichBatchErrorMessage }
      : {};
  }

  const notFoundRecordIds: string[] = [];
  const matchedRecords: MatchedRecord[] = [];

  for (let index = 0; index < recordsToEnrich.length; index++) {
    const { recordId, node: recordNode } = recordsToEnrich[index];
    const enrichmentOutcome = dropcontactEnrichmentOutcomes[index];

    if (
      !isDefined(enrichmentOutcome) ||
      enrichmentOutcome.outcome === 'error'
    ) {
      resultById.set(
        recordId,
        buildErrorResult({
          recordId,
          error: toDropcontactOutcomeErrorMessage(enrichmentOutcome),
        }),
      );
      outcomeErrorRecordIds.push(recordId);
      continue;
    }

    if (enrichmentOutcome.outcome === 'pending') {
      pendingRecords.push({ recordId, requestId: enrichmentOutcome.requestId });
      continue;
    }

    if (enrichmentOutcome.outcome === 'not_found') {
      notFoundRecordIds.push(recordId);
      continue;
    }

    try {
      const { mappedData, persistData } = await adapter.buildMatchedData({
        client,
        node: recordNode,
        outcome: enrichmentOutcome,
        enrichedAt,
        companyIdByMatchKeyCache,
        overrideExistingValues,
        shouldPersist,
      });
      matchedRecords.push({ recordId, mappedData, persistData });
    } catch (buildMatchedDataError) {
      resultById.set(
        recordId,
        buildErrorResult({
          recordId,
          error: toErrorMessage(buildMatchedDataError),
        }),
      );
      recordIdsToMarkAsError.push(recordId);
    }
  }

  const failedMatchedWriteRecordIds = await recordMatchedRecords({
    adapter,
    client,
    matchedRecords,
    shouldPersist,
    resultById,
  });
  recordIdsToMarkAsError.push(...failedMatchedWriteRecordIds);

  const failedNotFoundWriteRecordIds = await recordNotFoundRecords({
    adapter,
    client,
    notFoundRecordIds,
    shouldPersist,
    enrichedAt,
    resultById,
  });
  recordIdsToMarkAsError.push(...failedNotFoundWriteRecordIds);

  await recordPendingRecords({
    adapter,
    client,
    pendingRecords,
    shouldPersist,
    resultById,
  });

  if (shouldPersist) {
    // Results that arrived but could not be written are not collected again,
    // since that would bill the same batch twice
    await writeErrorStatusWithBackoff({
      adapter,
      client,
      recordIds: recordIdsToMarkAsError,
      enrichedAt,
      shouldClearRequestId: true,
    });
    await writeErrorStatusWithBackoff({
      adapter,
      client,
      recordIds: outcomeErrorRecordIds,
      enrichedAt,
      shouldClearRequestId: false,
    });
  }

  const hasOnlyDropcontactAccountErrorOutcomes =
    dropcontactEnrichmentOutcomes.length > 0 &&
    dropcontactEnrichmentOutcomes.every(isDropcontactAccountErrorOutcome);

  return {
    dropcontactAccessErrorMessage: hasOnlyDropcontactAccountErrorOutcomes
      ? DROPCONTACT_ACCESS_ERROR_MESSAGE
      : undefined,
  };
};
