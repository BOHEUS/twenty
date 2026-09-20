import { type CoreApiClient } from 'twenty-client-sdk/core';

import { ENRICHMENT_CHUNK_SIZE } from 'src/constants/enrichment-chunk-size';
import { aggregateBulkEnrichResult } from 'src/logic-functions/utils/aggregate-bulk-enrich-result';
import {
  buildErrorResult,
  ENRICHMENT_FAILED_MESSAGE,
} from 'src/logic-functions/utils/build-error-result';
import { chunk } from 'src/logic-functions/utils/chunk';
import { enrichChunk } from 'src/logic-functions/utils/enrich-chunk';
import { extractRecordIds } from 'src/logic-functions/utils/extract-record-ids';
import { type BulkEnrichInput } from 'src/types/bulk-enrich-input';
import { type BulkEnrichResult } from 'src/types/bulk-enrich-result';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type EnrichResult } from 'src/types/enrich-result';
import { type EnrichmentAdapter } from 'src/types/enrichment-adapter';
import { isDefined } from 'src/logic-functions/utils/is-defined';

export const runBatchEnrichment = async <TNode, TData, TParams>({
  client,
  input,
  adapter,
}: {
  client: CoreApiClient;
  input: BulkEnrichInput;
  adapter: EnrichmentAdapter<TNode, TData, TParams>;
}): Promise<BulkEnrichResult> => {
  const recordIds = Array.from(new Set(extractRecordIds(input.records)));
  const resultById = new Map<string, EnrichResult>();
  const companyIdByMatchKeyCache: CompanyIdByMatchKeyCache = new Map();
  let rocketReachAccessErrorMessage: string | undefined;

  for (const recordIdsChunk of chunk({
    items: recordIds,
    size: ENRICHMENT_CHUNK_SIZE,
  })) {
    const enrichChunkResult = await enrichChunk({
      client,
      recordIds: recordIdsChunk,
      input,
      adapter,
      resultById,
      companyIdByMatchKeyCache,
    });

    rocketReachAccessErrorMessage =
      enrichChunkResult.rocketReachAccessErrorMessage;

    if (isDefined(rocketReachAccessErrorMessage)) {
      break;
    }
  }

  const results = recordIds.map(
    (recordId) =>
      resultById.get(recordId) ??
      buildErrorResult({
        recordId,
        error: rocketReachAccessErrorMessage ?? ENRICHMENT_FAILED_MESSAGE,
      }),
  );

  return aggregateBulkEnrichResult(results);
};
