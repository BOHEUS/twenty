import { CoreApiClient } from 'twenty-client-sdk/core';
import { isDefined } from 'twenty-sdk/utils';

import { LUSHA_REVEAL_PHONES_VARIABLE_NAME } from 'src/constants/application-variable-names.constant';
import {
  LUSHA_API_KEY_MISSING_MESSAGE,
  LUSHA_COMPLIANCE_RESTRICTED_MESSAGE,
  LUSHA_NOT_ATTEMPTED_MESSAGE,
  LUSHA_OUT_OF_TIME_MESSAGE,
} from 'src/constants/enrichment-messages.constant';
import {
  ENRICHMENT_CONCURRENCY,
  ENRICHMENT_RUN_BUDGET_MILLISECONDS,
} from 'src/constants/enrichment-run.constant';
import { LUSHA_BATCH_SIZE } from 'src/constants/lusha-api.constant';
import { RECORD_READ_BATCH_SIZE } from 'src/constants/record-read-batch-size.constant';
import { chunk } from 'src/logic-functions/data/chunk';
import { toErrorMessage } from 'src/logic-functions/data/to-error-message';
import { toJsonObject } from 'src/logic-functions/data/to-json';
import { toText } from 'src/logic-functions/data/to-text';
import { type BulkEnrichmentInput } from 'src/logic-functions/types/bulk-enrichment-input.type';
import { type BulkEnrichmentResult } from 'src/logic-functions/types/bulk-enrichment-result.type';
import { type EnrichmentAdapter } from 'src/logic-functions/types/enrichment-adapter.type';
import { type EnrichmentResult } from 'src/logic-functions/types/enrichment-result.type';
import { type LushaRecord } from 'src/logic-functions/types/lusha-record.type';
import { aggregateBulkEnrichmentResult } from 'src/logic-functions/utils/aggregate-bulk-enrichment-result';
import { getLushaApiKey } from 'src/logic-functions/utils/get-lusha-api-key';
import { toRecordIds } from 'src/logic-functions/utils/to-record-ids';

type RunContext<
  TRecord extends { id: string },
  TSearchItem extends { clientReferenceId: string },
> = {
  adapter: EnrichmentAdapter<TRecord, TSearchItem>;
  client: CoreApiClient;
  apiKey: string;
  revealPhones: boolean;
  companyIdByDomain: Map<string, Promise<string | undefined>>;
};

type MatchableRecord<TRecord, TSearchItem> = {
  record: TRecord;
  searchItem: TSearchItem;
};

const BOOKKEEPING_FIELD_NAMES = new Set([
  'lushaEnrichmentStatus',
  'lushaLastEnrichedAt',
  'lushaRawPayload',
]);

const buildResult = ({
  recordId,
  status,
  message,
  data = {},
}: {
  recordId: string;
  status: EnrichmentResult['status'];
  message: string;
  data?: Record<string, unknown>;
}): EnrichmentResult => ({
  success: status === 'ENRICHED',
  recordId,
  status,
  updatedFields: Object.keys(data).filter(
    (fieldName) => !BOOKKEEPING_FIELD_NAMES.has(fieldName),
  ),
  message,
});

const buildErrorResults = ({
  recordIds,
  message,
}: {
  recordIds: string[];
  message: string;
}): EnrichmentResult[] =>
  recordIds.map((recordId) =>
    buildResult({ recordId, status: 'ERROR', message }),
  );

// Reads every requested record before calling Lusha so that each Lusha batch
// is filled with records it can actually match.
const readMatchableRecords = async <
  TRecord extends { id: string },
  TSearchItem extends { clientReferenceId: string },
>({
  adapter,
  client,
  recordIds,
}: {
  adapter: EnrichmentAdapter<TRecord, TSearchItem>;
  client: CoreApiClient;
  recordIds: string[];
}): Promise<{
  matchableRecords: MatchableRecord<TRecord, TSearchItem>[];
  results: EnrichmentResult[];
}> => {
  const matchableRecords: MatchableRecord<TRecord, TSearchItem>[] = [];
  const results: EnrichmentResult[] = [];

  for (const recordIdsChunk of chunk({
    items: recordIds,
    size: RECORD_READ_BATCH_SIZE,
  })) {
    let records: TRecord[];

    try {
      records = await adapter.readRecords({
        client,
        recordIds: recordIdsChunk,
      });
    } catch (readError) {
      results.push(
        ...buildErrorResults({
          recordIds: recordIdsChunk,
          message: toErrorMessage(readError),
        }),
      );
      continue;
    }

    const recordById = new Map(records.map((record) => [record.id, record]));

    for (const recordId of recordIdsChunk) {
      const record = recordById.get(recordId);
      const searchItem = isDefined(record)
        ? adapter.buildSearchItem(record)
        : undefined;

      if (!isDefined(record)) {
        results.push(
          buildResult({
            recordId,
            status: 'ERROR',
            message: `${adapter.objectNameSingular} ${recordId} was not found.`,
          }),
        );
      } else if (!isDefined(searchItem)) {
        results.push(
          buildResult({
            recordId,
            status: 'SKIPPED',
            message: adapter.noIdentifierMessage,
          }),
        );
      } else {
        matchableRecords.push({ record, searchItem });
      }
    }
  }

  return { matchableRecords, results };
};

const enrichRecord = async <
  TRecord extends { id: string },
  TSearchItem extends { clientReferenceId: string },
>({
  context: { adapter, client, companyIdByDomain },
  record,
  match,
  enrichedAt,
}: {
  context: RunContext<TRecord, TSearchItem>;
  record: TRecord;
  match: LushaRecord | undefined;
  enrichedAt: string;
}): Promise<EnrichmentResult> => {
  const recordId = record.id;
  const itemError = toJsonObject(match?.error);
  const itemErrorCode = toText(itemError?.code);

  if (!isDefined(match) || itemErrorCode === 'NOT_FOUND') {
    return buildResult({
      recordId,
      status: 'NOT_FOUND',
      message: adapter.notFoundMessage,
    });
  }

  if (itemErrorCode === 'COMPLIANCE_RESTRICTED') {
    return buildResult({
      recordId,
      status: 'NOT_FOUND',
      message: LUSHA_COMPLIANCE_RESTRICTED_MESSAGE,
    });
  }

  if (isDefined(itemError)) {
    return buildResult({
      recordId,
      status: 'ERROR',
      message:
        toText(itemError.message) ??
        `Lusha could not enrich this record (${itemErrorCode ?? 'unknown error'}).`,
    });
  }

  const data = await adapter.buildUpdateData({
    client,
    record,
    match,
    enrichedAt,
    companyIdByDomain,
  });
  const enrichedMessage = `Enriched ${adapter.objectNameSingular.toLowerCase()} from Lusha`;

  try {
    await adapter.updateRecord({ client, recordId, data });

    return buildResult({
      recordId,
      status: 'ENRICHED',
      message: `${enrichedMessage}.`,
      data,
    });
  } catch (writeError) {
    const droppedFieldNames = adapter.fieldNamesDroppableOnWriteFailure.filter(
      (fieldName) => fieldName in data,
    );

    if (droppedFieldNames.length === 0) {
      throw writeError;
    }

    const fallbackData = Object.fromEntries(
      Object.entries(data).filter(
        ([fieldName]) => !droppedFieldNames.includes(fieldName),
      ),
    );

    await adapter.updateRecord({ client, recordId, data: fallbackData });

    return buildResult({
      recordId,
      status: 'ENRICHED',
      message: `${enrichedMessage}, but could not save ${droppedFieldNames.join(' and ')}: ${toErrorMessage(writeError)}`,
      data: fallbackData,
    });
  }
};

const enrichMatchedRecords = async <
  TRecord extends { id: string },
  TSearchItem extends { clientReferenceId: string },
>({
  context,
  batch,
  matches,
  enrichedAt,
}: {
  context: RunContext<TRecord, TSearchItem>;
  batch: MatchableRecord<TRecord, TSearchItem>[];
  matches: LushaRecord[];
  enrichedAt: string;
}): Promise<EnrichmentResult[]> => {
  const matchByRecordId = new Map(
    matches.map((match) => [toText(match.clientReferenceId), match]),
  );
  const results: EnrichmentResult[] = [];

  for (const wave of chunk({ items: batch, size: ENRICHMENT_CONCURRENCY })) {
    results.push(
      ...(await Promise.all(
        wave.map(({ record }) =>
          enrichRecord({
            context,
            record,
            match: matchByRecordId.get(record.id),
            enrichedAt,
          }).catch((error) =>
            buildResult({
              recordId: record.id,
              status: 'ERROR',
              message: toErrorMessage(error),
            }),
          ),
        ),
      )),
    );
  }

  return results;
};

const enrichBatch = async <
  TRecord extends { id: string },
  TSearchItem extends { clientReferenceId: string },
>({
  context,
  batch,
}: {
  context: RunContext<TRecord, TSearchItem>;
  batch: MatchableRecord<TRecord, TSearchItem>[];
}): Promise<{
  results: EnrichmentResult[];
  accountFailureMessage: string | undefined;
}> => {
  const { adapter, client, apiKey, revealPhones } = context;
  const enrichedAt = new Date().toISOString();

  const searchResult = await adapter.searchAndEnrich({
    apiKey,
    items: batch.map(({ searchItem }) => searchItem),
    revealPhones,
  });

  const results = searchResult.success
    ? await enrichMatchedRecords({
        context,
        batch,
        matches: searchResult.data,
        enrichedAt,
      })
    : buildErrorResults({
        recordIds: batch.map(({ record }) => record.id),
        message: searchResult.error,
      });

  // The status field only mirrors the outcome, so a failed status write must
  // not change what the run reports.
  for (const status of ['NOT_FOUND', 'ERROR'] as const) {
    const statusRecordIds = results
      .filter((result) => result.status === status)
      .map(({ recordId }) => recordId);

    if (statusRecordIds.length > 0) {
      await adapter
        .updateManyStatus({
          client,
          recordIds: statusRecordIds,
          data: {
            lushaEnrichmentStatus: status,
            lushaLastEnrichedAt: enrichedAt,
          },
        })
        .catch(() => undefined);
    }
  }

  return {
    results,
    accountFailureMessage:
      !searchResult.success && searchResult.isAccountFailure
        ? searchResult.error
        : undefined,
  };
};

export const runBulkEnrichment = async <
  TRecord extends { id: string },
  TSearchItem extends { clientReferenceId: string },
>({
  input,
  adapter,
  client = new CoreApiClient(),
}: {
  input: BulkEnrichmentInput;
  adapter: EnrichmentAdapter<TRecord, TSearchItem>;
  client?: CoreApiClient;
}): Promise<BulkEnrichmentResult> => {
  const recordIds = toRecordIds(input.records);
  const apiKey = getLushaApiKey();

  if (!isDefined(apiKey)) {
    return aggregateBulkEnrichmentResult(
      buildErrorResults({ recordIds, message: LUSHA_API_KEY_MISSING_MESSAGE }),
    );
  }

  const context: RunContext<TRecord, TSearchItem> = {
    adapter,
    client,
    apiKey,
    // A command started from a record selection has no inputs, so revealing
    // phone numbers falls back to the workspace-wide app setting.
    revealPhones:
      input.revealPhones ??
      process.env[LUSHA_REVEAL_PHONES_VARIABLE_NAME] === 'true',
    companyIdByDomain: new Map(),
  };
  const { matchableRecords, results } = await readMatchableRecords({
    adapter,
    client,
    recordIds,
  });
  const runDeadline = Date.now() + ENRICHMENT_RUN_BUDGET_MILLISECONDS;
  let accountFailureMessage: string | undefined;

  for (const batch of chunk({
    items: matchableRecords,
    size: LUSHA_BATCH_SIZE,
  })) {
    const batchRecordIds = batch.map(({ record }) => record.id);

    if (isDefined(accountFailureMessage)) {
      results.push(
        ...buildErrorResults({
          recordIds: batchRecordIds,
          message: `${LUSHA_NOT_ATTEMPTED_MESSAGE}: ${accountFailureMessage}`,
        }),
      );
      continue;
    }

    if (Date.now() > runDeadline) {
      results.push(
        ...buildErrorResults({
          recordIds: batchRecordIds,
          message: LUSHA_OUT_OF_TIME_MESSAGE,
        }),
      );
      continue;
    }

    const batchOutcome = await enrichBatch({ context, batch });

    results.push(...batchOutcome.results);
    accountFailureMessage = batchOutcome.accountFailureMessage;
  }

  const resultByRecordId = new Map(
    results.map((result) => [result.recordId, result]),
  );

  return aggregateBulkEnrichmentResult(
    recordIds
      .map((recordId) => resultByRecordId.get(recordId))
      .filter(isDefined),
  );
};
