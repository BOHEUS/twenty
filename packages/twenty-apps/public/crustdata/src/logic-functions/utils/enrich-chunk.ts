import { type CoreApiClient } from 'twenty-client-sdk/core';

import {
  buildErrorResult,
  ENRICHMENT_FAILED_MESSAGE,
} from 'src/logic-functions/utils/build-error-result';
import { buildMatchedResult } from 'src/logic-functions/utils/build-matched-result';
import { buildNotFoundResult } from 'src/logic-functions/utils/build-not-found-result';
import { buildRedactedResult } from 'src/logic-functions/utils/build-redacted-result';
import { buildSkippedResult } from 'src/logic-functions/utils/build-skipped-result';
import { chargeCrustdataCredits } from 'src/logic-functions/utils/charge-crustdata-credits';
import { INTERNAL_BOOKKEEPING_FIELDS } from 'src/logic-functions/utils/internal-field-names';
import { nowIso } from 'src/logic-functions/utils/now-iso';
import { resolveUpdateFieldsMode } from 'src/logic-functions/utils/resolve-update-fields-mode';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type BulkEnrichInput } from 'src/types/bulk-enrich-input';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type CrustdataEnrichResult } from 'src/types/crustdata-enrich-result';
import { type EnrichResult } from 'src/types/enrich-result';
import { isDefined } from 'src/utils/is-defined';
import { toErrorMessage } from 'src/utils/to-error-message';

// The outcomes that are neither a match nor an error differ only in what they write and report.
const UNMATCHED_OUTCOMES = {
  not_found: { status: 'NOT_FOUND', buildResult: buildNotFoundResult },
  redacted: { status: 'REDACTED', buildResult: buildRedactedResult },
} as const;

type UnmatchedOutcome = keyof typeof UNMATCHED_OUTCOMES;

const isUnmatchedOutcome = <TData>(
  enrichmentOutcome: CrustdataEnrichResult<TData>,
): enrichmentOutcome is Extract<
  CrustdataEnrichResult<TData>,
  { outcome: UnmatchedOutcome }
> => enrichmentOutcome.outcome in UNMATCHED_OUTCOMES;

type MatchedRecord = {
  recordId: string;
  mappedData: Record<string, unknown>;
  persistData: Record<string, unknown>;
};

const writeStatus = async <TNode, TData, TParams>({
  adapter,
  client,
  recordIds,
  status,
  enrichedAt,
}: {
  adapter: BatchEnrichmentAdapter<TNode, TData, TParams>;
  client: CoreApiClient;
  recordIds: string[];
  status: string;
  enrichedAt: string;
}): Promise<void> => {
  if (recordIds.length === 0) {
    return;
  }

  await adapter.updateManyStatus({
    client,
    recordIds,
    data: {
      crustdataEnrichmentStatus: status,
      crustdataLastEnrichedAt: enrichedAt,
    },
  });
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

const recordUnmatchedRecords = async <TNode, TData, TParams>({
  adapter,
  client,
  recordIds,
  status,
  buildResult,
  shouldPersist,
  enrichedAt,
  resultById,
}: {
  adapter: BatchEnrichmentAdapter<TNode, TData, TParams>;
  client: CoreApiClient;
  recordIds: string[];
  status: string;
  buildResult: (recordId: string) => EnrichResult;
  shouldPersist: boolean;
  enrichedAt: string;
  resultById: Map<string, EnrichResult>;
}): Promise<string[]> => {
  if (recordIds.length === 0) {
    return [];
  }

  if (!shouldPersist) {
    for (const recordId of recordIds) {
      resultById.set(recordId, buildResult(recordId));
    }

    return [];
  }

  try {
    await writeStatus({ adapter, client, recordIds, status, enrichedAt });

    for (const recordId of recordIds) {
      resultById.set(recordId, buildResult(recordId));
    }

    return [];
  } catch (statusWriteError) {
    const statusWriteErrorMessage = toErrorMessage(statusWriteError);

    for (const recordId of recordIds) {
      resultById.set(
        recordId,
        buildErrorResult({ recordId, error: statusWriteErrorMessage }),
      );
    }

    return recordIds;
  }
};

export const enrichChunk = async <TNode, TData, TParams>({
  client,
  recordIds,
  input,
  adapter,
  resultById,
  companyIdByMatchKeyCache,
}: {
  client: CoreApiClient;
  recordIds: string[];
  input: BulkEnrichInput;
  adapter: BatchEnrichmentAdapter<TNode, TData, TParams>;
  resultById: Map<string, EnrichResult>;
  companyIdByMatchKeyCache: CompanyIdByMatchKeyCache;
}): Promise<void> => {
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

    return;
  }

  const nodeByRecordId = new Map(
    recordNodes.map((recordNode) => [adapter.getNodeId(recordNode), recordNode]),
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

    const matchParams = adapter.extractParams({ node: recordNode, input });

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
    return;
  }

  const enrichedAt = nowIso();
  const recordIdsToMarkAsError: string[] = [];

  let enrichmentOutcomes: CrustdataEnrichResult<TData>[];
  let creditsUsed: number;

  try {
    const batchResult = await adapter.enrichBatch(
      recordsToEnrich.map((recordToEnrich) => recordToEnrich.params),
    );

    enrichmentOutcomes = batchResult.results;
    creditsUsed = batchResult.creditsUsed;
  } catch (enrichBatchError) {
    const enrichBatchErrorMessage = toErrorMessage(enrichBatchError);

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
      await writeStatus({
        adapter,
        client,
        recordIds: recordsToEnrich.map(
          (recordToEnrich) => recordToEnrich.recordId,
        ),
        status: 'ERROR',
        enrichedAt,
      }).catch(() => undefined);
    }

    return;
  }

  await chargeCrustdataCredits({
    creditsUsed,
    matchedCount: enrichmentOutcomes.filter(
      (enrichmentOutcome) => enrichmentOutcome?.outcome === 'matched',
    ).length,
    resourceContext: adapter.resourceContext,
  });

  const recordIdsByUnmatchedOutcome = new Map<UnmatchedOutcome, string[]>();
  const matchedRecords: MatchedRecord[] = [];

  for (let index = 0; index < recordsToEnrich.length; index++) {
    const { recordId, node: recordNode } = recordsToEnrich[index];
    const enrichmentOutcome = enrichmentOutcomes[index];

    if (!isDefined(enrichmentOutcome) || enrichmentOutcome.outcome === 'error') {
      resultById.set(
        recordId,
        buildErrorResult({
          recordId,
          error: isDefined(enrichmentOutcome)
            ? enrichmentOutcome.message
            : ENRICHMENT_FAILED_MESSAGE,
        }),
      );
      recordIdsToMarkAsError.push(recordId);
      continue;
    }

    if (isUnmatchedOutcome(enrichmentOutcome)) {
      const recordIdsForOutcome =
        recordIdsByUnmatchedOutcome.get(enrichmentOutcome.outcome) ?? [];

      recordIdsForOutcome.push(recordId);
      recordIdsByUnmatchedOutcome.set(
        enrichmentOutcome.outcome,
        recordIdsForOutcome,
      );
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

  recordIdsToMarkAsError.push(
    ...(await recordMatchedRecords({
      adapter,
      client,
      matchedRecords,
      shouldPersist,
      resultById,
    })),
  );

  for (const [
    unmatchedOutcome,
    recordIdsForOutcome,
  ] of recordIdsByUnmatchedOutcome) {
    recordIdsToMarkAsError.push(
      ...(await recordUnmatchedRecords({
        adapter,
        client,
        recordIds: recordIdsForOutcome,
        ...UNMATCHED_OUTCOMES[unmatchedOutcome],
        shouldPersist,
        enrichedAt,
        resultById,
      })),
    );
  }

  if (shouldPersist) {
    await writeStatus({
      adapter,
      client,
      recordIds: recordIdsToMarkAsError,
      status: 'ERROR',
      enrichedAt,
    }).catch(() => undefined);
  }
};
