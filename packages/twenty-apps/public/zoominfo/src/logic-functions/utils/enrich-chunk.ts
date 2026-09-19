import { type CoreApiClient } from 'twenty-client-sdk/core';
import { isDefined } from 'twenty-sdk/utils';

import { buildErrorResult } from 'src/logic-functions/utils/build-error-result';
import { buildSkippedResult } from 'src/logic-functions/utils/build-skipped-result';
import { recordMatchedRecords } from 'src/logic-functions/utils/enrich-chunk/record-matched-records';
import { recordNotFoundRecords } from 'src/logic-functions/utils/enrich-chunk/record-not-found-records';
import { writeErrorStatus } from 'src/logic-functions/utils/enrich-chunk/write-error-status';
import { nowIso } from 'src/logic-functions/utils/now-iso';
import { resolveUpdateFieldsMode } from 'src/logic-functions/utils/resolve-update-fields-mode';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type BulkEnrichInput } from 'src/types/bulk-enrich-input';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type EnrichResult } from 'src/types/enrich-result';
import { type MatchedRecord } from 'src/types/matched-record';
import { type NotFoundRecord } from 'src/types/not-found-record';
import { type ZoomInfoEnrichResult } from 'src/types/zoominfo-enrich-result';
import { toErrorMessage } from 'src/utils/to-error-message';

export const enrichChunk = async <TNode, TData, TInput>({
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
  adapter: BatchEnrichmentAdapter<TNode, TData, TInput>;
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
    recordNodes.map((recordNode) => [
      adapter.getNodeId(recordNode),
      recordNode,
    ]),
  );

  const recordsToEnrich: {
    recordId: string;
    node: TNode;
    matchInput: TInput;
  }[] = [];

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

    const matchInput = adapter.extractMatchInput({ node: recordNode, input });
    if (!isDefined(matchInput)) {
      resultById.set(
        recordId,
        buildSkippedResult({
          recordId,
          message: adapter.noIdentifierMessage,
        }),
      );
      continue;
    }

    recordsToEnrich.push({ recordId, node: recordNode, matchInput });
  }

  if (recordsToEnrich.length === 0) {
    return;
  }

  const enrichedAt = nowIso();
  const recordIdsToMarkAsError: string[] = [];

  let enrichmentOutcomes: ZoomInfoEnrichResult<TData>[];
  try {
    enrichmentOutcomes = await adapter.enrichBatch(
      recordsToEnrich.map((recordToEnrich) => recordToEnrich.matchInput),
    );
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
      await writeErrorStatus({
        adapter,
        client,
        recordIds: recordsToEnrich.map(
          (recordToEnrich) => recordToEnrich.recordId,
        ),
        enrichedAt,
      });
    }

    return;
  }

  if (shouldPersist && adapter.preloadMatchedRelations !== undefined) {
    const matchedData = enrichmentOutcomes.flatMap((enrichmentOutcome) =>
      enrichmentOutcome?.outcome === 'matched' ? [enrichmentOutcome.data] : [],
    );

    // Purely an optimisation over the per-record lookup, so a failure here
    // falls through to it rather than failing the chunk.
    await adapter
      .preloadMatchedRelations({
        client,
        matchedData,
        companyIdByMatchKeyCache,
      })
      .catch(() => undefined);
  }

  const notFoundRecords: NotFoundRecord[] = [];
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
            : 'ZoomInfo returned no response for this record.',
        }),
      );
      recordIdsToMarkAsError.push(recordId);
      continue;
    }

    if (enrichmentOutcome.outcome === 'not_found') {
      notFoundRecords.push({
        recordId,
        matchStatus: enrichmentOutcome.matchStatus,
      });
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

  recordIdsToMarkAsError.push(
    ...(await recordNotFoundRecords({
      adapter,
      client,
      notFoundRecords,
      shouldPersist,
      enrichedAt,
      resultById,
    })),
  );

  if (shouldPersist) {
    await writeErrorStatus({
      adapter,
      client,
      recordIds: recordIdsToMarkAsError,
      enrichedAt,
    });
  }
};
