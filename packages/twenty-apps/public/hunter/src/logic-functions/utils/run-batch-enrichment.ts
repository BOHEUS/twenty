import { type CoreApiClient } from 'twenty-client-sdk/core';

import { HUNTER_BATCH_SIZE } from 'src/constants/hunter-batch-size';
import { HUNTER_RUN_BUDGET_MS } from 'src/constants/hunter-request-timing';
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
  const deadline = Date.now() + HUNTER_RUN_BUDGET_MS;
  let hunterAccessErrorMessage: string | undefined;

  for (const recordIdsChunk of chunk({
    items: recordIds,
    size: HUNTER_BATCH_SIZE,
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

    hunterAccessErrorMessage = enrichChunkResult.hunterAccessErrorMessage;

    if (isDefined(hunterAccessErrorMessage)) {
      break;
    }
  }

  const results = recordIds.map(
    (recordId) =>
      resultById.get(recordId) ??
      buildErrorResult({
        recordId,
        error: hunterAccessErrorMessage ?? ENRICHMENT_FAILED_MESSAGE,
      }),
  );

  return aggregateBulkEnrichResult(results);
};
