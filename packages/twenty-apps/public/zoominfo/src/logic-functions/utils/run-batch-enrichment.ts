import { type CoreApiClient } from 'twenty-client-sdk/core';

import { ZOOMINFO_BATCH_SIZE } from 'src/constants/zoominfo-batch-size';
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

export const runBatchEnrichment = async <TNode, TData, TInput>({
  client,
  input,
  adapter,
}: {
  client: CoreApiClient;
  input: BulkEnrichInput;
  adapter: BatchEnrichmentAdapter<TNode, TData, TInput>;
}): Promise<BulkEnrichResult> => {
  const recordIds = Array.from(new Set(extractRecordIds(input.records)));
  const resultById = new Map<string, EnrichResult>();
  const companyIdByMatchKeyCache: CompanyIdByMatchKeyCache = new Map();

  for (const recordIdsChunk of chunk({
    items: recordIds,
    size: ZOOMINFO_BATCH_SIZE,
  })) {
    await enrichChunk({
      client,
      recordIds: recordIdsChunk,
      input,
      adapter,
      resultById,
      companyIdByMatchKeyCache,
    });
  }

  const results = recordIds.map(
    (recordId) =>
      resultById.get(recordId) ??
      buildErrorResult({ recordId, error: ENRICHMENT_FAILED_MESSAGE }),
  );

  return aggregateBulkEnrichResult(results);
};
