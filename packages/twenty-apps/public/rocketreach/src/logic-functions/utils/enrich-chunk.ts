import { type CoreApiClient } from 'twenty-client-sdk/core';

import { ROCKETREACH_ACCESS_ERROR_MESSAGE } from 'src/constants/rocketreach-access-error-message';
import { RocketReachConfigError } from 'src/logic-functions/errors/rocketreach-config-error';
import { buildErrorResult } from 'src/logic-functions/utils/build-error-result';
import { buildMatchedResult } from 'src/logic-functions/utils/build-matched-result';
import { buildNotFoundResult } from 'src/logic-functions/utils/build-not-found-result';
import { buildPendingResult } from 'src/logic-functions/utils/build-pending-result';
import { buildSkippedResult } from 'src/logic-functions/utils/build-skipped-result';
import { chargeMatchedLookups } from 'src/logic-functions/utils/charge-matched-lookups';
import { INTERNAL_BOOKKEEPING_FIELDS } from 'src/logic-functions/utils/internal-field-names';
import { isRocketReachAccountErrorOutcome } from 'src/logic-functions/utils/is-rocketreach-account-error-outcome';
import { nowIso } from 'src/logic-functions/utils/now-iso';
import { resolveRevealSettings } from 'src/logic-functions/utils/resolve-reveal-settings';
import { resolveUpdateFieldsMode } from 'src/logic-functions/utils/resolve-update-fields-mode';
import { toLookupErrorMessage } from 'src/logic-functions/utils/to-lookup-error-message';
import { type BulkEnrichInput } from 'src/types/bulk-enrich-input';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type EnrichChunkResult } from 'src/types/enrich-chunk-result';
import { type EnrichResult } from 'src/types/enrich-result';
import { type EnrichmentAdapter } from 'src/types/enrichment-adapter';
import { type RocketReachLookupResult } from 'src/types/rocketreach-lookup-result';
import { isDefined } from 'src/logic-functions/utils/is-defined';
import { toErrorMessage } from 'src/logic-functions/utils/to-error-message';

type WriteableRecord = {
  recordId: string;
  isPending: boolean;
  mappedData: Record<string, unknown>;
  persistData: Record<string, unknown>;
};

const writeErrorStatus = async <TNode, TData, TParams>({
  adapter,
  client,
  recordIds,
  enrichedAt,
}: {
  adapter: EnrichmentAdapter<TNode, TData, TParams>;
  client: CoreApiClient;
  recordIds: string[];
  enrichedAt: string;
}): Promise<void> => {
  if (recordIds.length === 0) {
    return;
  }

  await adapter
    .updateManyStatus({
      client,
      recordIds,
      data: {
        rocketReachEnrichmentStatus: 'ERROR',
        rocketReachLastEnrichedAt: enrichedAt,
      },
    })
    .catch(() => undefined);
};

const buildWrittenResult = ({
  recordId,
  isPending,
  updatedFields,
  data,
}: {
  recordId: string;
  isPending: boolean;
  updatedFields: string[];
  data?: Record<string, unknown>;
}): EnrichResult =>
  isPending
    ? buildPendingResult({ recordId, updatedFields, data })
    : buildMatchedResult({ recordId, updatedFields, data });

const recordWriteableRecords = async <TNode, TData, TParams>({
  adapter,
  client,
  writeableRecords,
  shouldPersist,
  resultById,
}: {
  adapter: EnrichmentAdapter<TNode, TData, TParams>;
  client: CoreApiClient;
  writeableRecords: WriteableRecord[];
  shouldPersist: boolean;
  resultById: Map<string, EnrichResult>;
}): Promise<string[]> => {
  if (writeableRecords.length === 0) {
    return [];
  }

  if (!shouldPersist) {
    for (const writeableRecord of writeableRecords) {
      resultById.set(
        writeableRecord.recordId,
        buildWrittenResult({
          recordId: writeableRecord.recordId,
          isPending: writeableRecord.isPending,
          updatedFields: [],
          data: writeableRecord.mappedData,
        }),
      );
    }

    return [];
  }

  const settledWriteResults = await Promise.allSettled(
    writeableRecords.map((writeableRecord) =>
      adapter.updateOne({
        client,
        recordId: writeableRecord.recordId,
        data: writeableRecord.persistData,
      }),
    ),
  );

  const failedRecordIds: string[] = [];
  for (const [index, writeResult] of settledWriteResults.entries()) {
    const writeableRecord = writeableRecords[index];

    if (writeResult.status === 'rejected') {
      resultById.set(
        writeableRecord.recordId,
        buildErrorResult({
          recordId: writeableRecord.recordId,
          error: toErrorMessage(writeResult.reason),
        }),
      );
      failedRecordIds.push(writeableRecord.recordId);
      continue;
    }

    resultById.set(
      writeableRecord.recordId,
      buildWrittenResult({
        recordId: writeableRecord.recordId,
        isPending: writeableRecord.isPending,
        updatedFields: Object.keys(writeableRecord.persistData).filter(
          (fieldName) => !INTERNAL_BOOKKEEPING_FIELDS.has(fieldName),
        ),
        data: writeableRecord.mappedData,
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
  adapter: EnrichmentAdapter<TNode, TData, TParams>;
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
        rocketReachEnrichmentStatus: 'NOT_FOUND',
        rocketReachLastEnrichedAt: enrichedAt,
      },
    });
    for (const recordId of notFoundRecordIds) {
      resultById.set(recordId, buildNotFoundResult(recordId));
    }

    return [];
  } catch (notFoundStatusWriteError) {
    const errorMessage = toErrorMessage(notFoundStatusWriteError);
    for (const recordId of notFoundRecordIds) {
      resultById.set(
        recordId,
        buildErrorResult({ recordId, error: errorMessage }),
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
}: {
  client: CoreApiClient;
  recordIds: string[];
  input: BulkEnrichInput;
  adapter: EnrichmentAdapter<TNode, TData, TParams>;
  resultById: Map<string, EnrichResult>;
  companyIdByMatchKeyCache: CompanyIdByMatchKeyCache;
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

  const recordsToLookUp: { recordId: string; node: TNode; params: TParams }[] =
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

    recordsToLookUp.push({ recordId, node: recordNode, params: matchParams });
  }

  if (recordsToLookUp.length === 0) {
    return {};
  }

  const enrichedAt = nowIso();
  const recordIdsToMarkAsError: string[] = [];
  const revealSettings = resolveRevealSettings(input);

  let lookupResults: RocketReachLookupResult<TData>[];
  try {
    lookupResults = await adapter.lookupMany({
      params: recordsToLookUp.map((recordToLookUp) => recordToLookUp.params),
      revealSettings,
    });
  } catch (lookupError) {
    const isConfigError = lookupError instanceof RocketReachConfigError;
    const lookupErrorMessage = isConfigError
      ? ROCKETREACH_ACCESS_ERROR_MESSAGE
      : toErrorMessage(lookupError);

    for (const recordToLookUp of recordsToLookUp) {
      resultById.set(
        recordToLookUp.recordId,
        buildErrorResult({
          recordId: recordToLookUp.recordId,
          error: lookupErrorMessage,
        }),
      );
    }
    if (shouldPersist) {
      await writeErrorStatus({
        adapter,
        client,
        recordIds: recordsToLookUp.map(
          (recordToLookUp) => recordToLookUp.recordId,
        ),
        enrichedAt,
      });
    }

    return isConfigError
      ? { rocketReachAccessErrorMessage: lookupErrorMessage }
      : {};
  }

  await chargeMatchedLookups({
    matchedCount: lookupResults.filter(
      (lookupResult) => lookupResult?.outcome === 'matched',
    ).length,
    rocketReachCreditsPerMatch: adapter.countCreditsPerMatch(revealSettings),
    resourceContext: `rocketreach/${adapter.objectNameSingular.toLowerCase()}`,
  });

  const notFoundRecordIds: string[] = [];
  const writeableRecords: WriteableRecord[] = [];

  for (let index = 0; index < recordsToLookUp.length; index++) {
    const { recordId, node: recordNode } = recordsToLookUp[index];
    const lookupResult = lookupResults[index];

    if (!isDefined(lookupResult) || lookupResult.outcome === 'error') {
      resultById.set(
        recordId,
        buildErrorResult({
          recordId,
          error: toLookupErrorMessage(lookupResult),
        }),
      );
      recordIdsToMarkAsError.push(recordId);
      continue;
    }

    if (lookupResult.outcome === 'not_found') {
      notFoundRecordIds.push(recordId);
      continue;
    }

    const isPending = lookupResult.outcome === 'pending';

    try {
      const { mappedData, persistData } = await adapter.buildMatchedData({
        client,
        node: recordNode,
        data: lookupResult.data,
        isPending,
        enrichedAt,
        companyIdByMatchKeyCache,
        overrideExistingValues,
        shouldPersist,
      });
      writeableRecords.push({ recordId, isPending, mappedData, persistData });
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
    ...(await recordWriteableRecords({
      adapter,
      client,
      writeableRecords,
      shouldPersist,
      resultById,
    })),
  );

  recordIdsToMarkAsError.push(
    ...(await recordNotFoundRecords({
      adapter,
      client,
      notFoundRecordIds,
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

  const hasOnlyAccountErrors =
    lookupResults.length > 0 &&
    lookupResults.every(isRocketReachAccountErrorOutcome);

  return {
    rocketReachAccessErrorMessage: hasOnlyAccountErrors
      ? ROCKETREACH_ACCESS_ERROR_MESSAGE
      : undefined,
  };
};
