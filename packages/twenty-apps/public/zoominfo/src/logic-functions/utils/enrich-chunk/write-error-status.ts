import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';

export const writeErrorStatus = async <TNode, TData, TInput>({
  adapter,
  client,
  recordIds,
  enrichedAt,
}: {
  adapter: BatchEnrichmentAdapter<TNode, TData, TInput>;
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
        zoomInfoEnrichmentStatus: 'ERROR',
        zoomInfoLastEnrichedAt: enrichedAt,
      },
    })
    .catch(() => undefined);
};
