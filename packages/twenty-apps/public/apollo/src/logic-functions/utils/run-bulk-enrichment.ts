import { CoreApiClient } from 'twenty-client-sdk/core';
import {
  reportConnectionAuthFailure,
  type LogicFunctionExecutionContext,
} from 'twenty-sdk/logic-function';

import { APOLLO_BULK_BATCH_SIZE } from 'src/constants/bulk-batch-size.constant';
import { APOLLO_NOT_CONNECTED_MESSAGE } from 'src/constants/enrichment-messages.constant';
import { type BulkEnrichmentAdapter } from 'src/logic-functions/types/bulk-enrichment-adapter.type';
import { type BulkEnrichmentInput } from 'src/logic-functions/types/bulk-enrichment-input.type';
import { type BulkEnrichmentResult } from 'src/logic-functions/types/bulk-enrichment-result.type';
import { type EnrichmentResult } from 'src/logic-functions/types/enrichment-result.type';
import { aggregateBulkEnrichmentResult } from 'src/logic-functions/utils/aggregate-bulk-enrichment-result';
import { findApolloConnection } from 'src/logic-functions/utils/find-apollo-connection';
import { toRecordIds } from 'src/logic-functions/utils/to-record-ids';
import { chunk } from '../data/chunk';
import { isDefined } from '../data/is-defined';
import { toErrorMessage } from '../data/to-error-message';

type ResultByRecordId = Map<string, EnrichmentResult>;

type MatchableRecord<TMatchParams> = {
  recordId: string;
  params: TMatchParams;
};

const buildResult = ({
  recordId,
  status,
  message,
  updatedFields = [],
}: {
  recordId: string;
  status: EnrichmentResult['status'];
  message: string;
  updatedFields?: string[];
}): EnrichmentResult => ({
  success: status === 'ENRICHED',
  recordId,
  status,
  updatedFields,
  message,
});

const setResults = ({
  resultByRecordId,
  recordIds,
  status,
  message,
}: {
  resultByRecordId: ResultByRecordId;
  recordIds: string[];
  status: EnrichmentResult['status'];
  message: string;
}): void => {
  for (const recordId of recordIds) {
    resultByRecordId.set(recordId, buildResult({ recordId, status, message }));
  }
};

// Reads every requested record up front so the Apollo batches below are full:
// batching the raw ids instead would spend a whole ten-record call on the one
// record of a batch that turns out to be matchable.
const collectMatchableRecords = async <
  TRecord extends { id: string },
  TMatchParams,
>({
  adapter,
  client,
  recordIds,
  resultByRecordId,
}: {
  adapter: BulkEnrichmentAdapter<TRecord, TMatchParams>;
  client: CoreApiClient;
  recordIds: string[];
  resultByRecordId: ResultByRecordId;
}): Promise<MatchableRecord<TMatchParams>[]> => {
  let records: TRecord[];

  try {
    records = await adapter.readRecords({ client, recordIds });
  } catch (readError) {
    setResults({
      resultByRecordId,
      recordIds,
      status: 'ERROR',
      message: toErrorMessage(readError),
    });

    return [];
  }

  const recordById = new Map(records.map((record) => [record.id, record]));
  const matchableRecords: MatchableRecord<TMatchParams>[] = [];

  for (const recordId of recordIds) {
    const record = recordById.get(recordId);

    if (!isDefined(record)) {
      resultByRecordId.set(
        recordId,
        buildResult({
          recordId,
          status: 'ERROR',
          message: `${adapter.objectNameSingular} ${recordId} was not found.`,
        }),
      );
      continue;
    }

    const params = adapter.buildMatchParams(record);

    if (!isDefined(params)) {
      resultByRecordId.set(
        recordId,
        buildResult({
          recordId,
          status: 'SKIPPED',
          message: adapter.noIdentifierMessage,
        }),
      );
      continue;
    }

    matchableRecords.push({ recordId, params });
  }

  return matchableRecords;
};

const enrichBatch = async <TRecord extends { id: string }, TMatchParams>({
  adapter,
  client,
  accessToken,
  revealPersonalEmails,
  matchableRecords,
  resultByRecordId,
}: {
  adapter: BulkEnrichmentAdapter<TRecord, TMatchParams>;
  client: CoreApiClient;
  accessToken: string;
  revealPersonalEmails: boolean;
  matchableRecords: MatchableRecord<TMatchParams>[];
  resultByRecordId: ResultByRecordId;
}): Promise<{ isAuthFailure: boolean }> => {
  const enrichedAt = new Date().toISOString();

  const writeStatus = (recordIds: string[], status: 'NOT_FOUND' | 'ERROR') =>
    adapter.updateManyStatus({
      client,
      recordIds,
      data: {
        apolloLastEnrichedAt: enrichedAt,
        apolloEnrichmentStatus: status,
      },
    });

  const matchResult = await adapter.fetchMatches({
    params: matchableRecords.map(({ params }) => params),
    accessToken,
    revealPersonalEmails,
  });

  if (!matchResult.success) {
    const recordIds = matchableRecords.map(({ recordId }) => recordId);

    // The records are already reported as errors, so a status write that fails
    // on top of that has nothing left to change about the outcome.
    await writeStatus(recordIds, 'ERROR').catch(() => undefined);
    setResults({
      resultByRecordId,
      recordIds,
      status: 'ERROR',
      message: matchResult.error,
    });

    return { isAuthFailure: matchResult.isAuthFailure };
  }

  const notFoundRecordIds: string[] = [];
  const matched: { recordId: string; data: Record<string, unknown> }[] = [];

  matchableRecords.forEach(({ recordId }, index) => {
    const match = matchResult.data[index];

    if (!isDefined(match)) {
      notFoundRecordIds.push(recordId);

      return;
    }

    matched.push({ recordId, data: adapter.buildData({ match, enrichedAt }) });
  });

  if (notFoundRecordIds.length > 0) {
    try {
      await writeStatus(notFoundRecordIds, 'NOT_FOUND');
      setResults({
        resultByRecordId,
        recordIds: notFoundRecordIds,
        status: 'NOT_FOUND',
        message: adapter.notFoundMessage,
      });
    } catch (statusWriteError) {
      // Unlike the paths above, nothing else reports these records, so a failed
      // status write is the only thing that happened to them.
      setResults({
        resultByRecordId,
        recordIds: notFoundRecordIds,
        status: 'ERROR',
        message: toErrorMessage(statusWriteError),
      });
    }
  }

  const writeResults = await Promise.allSettled(
    matched.map(({ recordId, data }) =>
      adapter.updateRecord({ client, recordId, data }),
    ),
  );

  const enrichedMessage = `Enriched ${adapter.objectNameSingular.toLowerCase()} from Apollo.`;
  const failedRecordIds: string[] = [];

  writeResults.forEach((writeResult, index) => {
    const { recordId, data } = matched[index];

    if (writeResult.status === 'rejected') {
      failedRecordIds.push(recordId);
      resultByRecordId.set(
        recordId,
        buildResult({
          recordId,
          status: 'ERROR',
          message: toErrorMessage(writeResult.reason),
        }),
      );

      return;
    }

    resultByRecordId.set(
      recordId,
      buildResult({
        recordId,
        status: 'ENRICHED',
        message: enrichedMessage,
        updatedFields: Object.keys(data),
      }),
    );
  });

  if (failedRecordIds.length > 0) {
    await writeStatus(failedRecordIds, 'ERROR').catch(() => undefined);
  }

  return { isAuthFailure: false };
};

export const runBulkEnrichment = async <
  TRecord extends { id: string },
  TMatchParams,
>({
  input,
  adapter,
  context,
  client = new CoreApiClient(),
}: {
  input: BulkEnrichmentInput;
  adapter: BulkEnrichmentAdapter<TRecord, TMatchParams>;
  context: Pick<LogicFunctionExecutionContext, 'userWorkspaceId'>;
  client?: CoreApiClient;
}): Promise<BulkEnrichmentResult> => {
  const recordIds = toRecordIds(input.records);
  const connection = await findApolloConnection(context);
  const resultByRecordId: ResultByRecordId = new Map();

  if (!isDefined(connection)) {
    setResults({
      resultByRecordId,
      recordIds,
      status: 'ERROR',
      message: APOLLO_NOT_CONNECTED_MESSAGE,
    });
  } else {
    const matchableRecords = await collectMatchableRecords({
      adapter,
      client,
      recordIds,
      resultByRecordId,
    });

    for (const batch of chunk({
      items: matchableRecords,
      size: APOLLO_BULK_BATCH_SIZE,
    })) {
      const { isAuthFailure } = await enrichBatch({
        adapter,
        client,
        accessToken: connection.accessToken,
        revealPersonalEmails: input.revealPersonalEmails ?? false,
        matchableRecords: batch,
        resultByRecordId,
      });

      if (isAuthFailure) {
        // Every remaining batch would be rejected the same way, so stop and
        // let the platform show the connection as needing a reconnect.
        await reportConnectionAuthFailure({
          connectionId: connection.id,
          reason: 'Apollo rejected the access token.',
        }).catch(() => undefined);
        break;
      }
    }
  }

  return aggregateBulkEnrichmentResult(
    recordIds
      .map((recordId) => resultByRecordId.get(recordId))
      .filter(isDefined),
  );
};
