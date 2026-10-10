import { type CoreApiClient } from 'twenty-client-sdk/core';

import { DROPCONTACT_BATCH_SIZE } from 'src/constants/dropcontact-batch-size';
import { DROPCONTACT_POLL_BUDGET_MS } from 'src/constants/dropcontact-polling';
import { aggregateBulkEnrichResult } from 'src/logic-functions/utils/aggregate-bulk-enrich-result';
import {
  buildErrorResult,
  ENRICHMENT_FAILED_MESSAGE,
} from 'src/logic-functions/utils/build-error-result';
import { chunk } from 'src/logic-functions/utils/chunk';
import { enrichChunk } from 'src/logic-functions/utils/enrich-chunk';
import { extractRecordIds } from 'src/logic-functions/utils/extract-record-ids';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type BulkEnrichInput } from 'src/types/bulk-enrich-input';
import { type BulkEnrichResult } from 'src/types/bulk-enrich-result';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type EnrichResult } from 'src/types/enrich-result';
import { isDefined } from 'src/utils/is-defined';

export const runBatchEnrichment = async <TNode, TData, TParams>({
  client,
  input,
  adapter,
}: {
  client: CoreApiClient;
  input: BulkEnrichInput;
  adapter: BatchEnrichmentAdapter<TNode, TData, TParams>;
}): Promise<BulkEnrichResult> => {
  const recordIds = Array.from(new Set(extractRecordIds(input.records)));
  const resultById = new Map<string, EnrichResult>();
  const companyIdByMatchKeyCache: CompanyIdByMatchKeyCache = new Map();
  const deadline = Date.now() + DROPCONTACT_POLL_BUDGET_MS;
  let dropcontactAccessErrorMessage: string | undefined;

  for (const recordIdsChunk of chunk({
    items: recordIds,
    size: DROPCONTACT_BATCH_SIZE,
  })) {
    const enrichChunkResult = await enrichChunk({
      client,
      recordIds: recordIdsChunk,
      input,
      adapter,
      resultById,
      companyIdByMatchKeyCache,
      deadline,
    });

    dropcontactAccessErrorMessage =
      enrichChunkResult.dropcontactAccessErrorMessage;

    if (isDefined(dropcontactAccessErrorMessage)) {
      break;
    }
  }

  const results = recordIds.map(
    (recordId) =>
      resultById.get(recordId) ??
      buildErrorResult({
        recordId,
        error: dropcontactAccessErrorMessage ?? ENRICHMENT_FAILED_MESSAGE,
      }),
  );

  return aggregateBulkEnrichResult(results);
};
