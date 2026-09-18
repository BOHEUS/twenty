import { pickWritableStandard } from 'src/logic-functions/utils/pick-writable-standard';
import { type MappedRecord } from 'src/logic-functions/types/mapped-record';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';

export const buildMatchedData = async <TNode, TData>({
  node,
  outcome,
  enrichedAt,
  overrideExistingValues,
  shouldPersist,
  map,
  emptyChecks,
  buildExtraPersistData,
}: {
  node: TNode;
  outcome: { matchScore?: number; data: TData };
  enrichedAt: string;
  overrideExistingValues: boolean;
  shouldPersist: boolean;
  map: (data: TData) => MappedRecord;
  emptyChecks: Record<string, (current: unknown) => boolean>;
  buildExtraPersistData?: () => Promise<Record<string, unknown>>;
}): Promise<{
  mappedData: Record<string, unknown>;
  persistData: Record<string, unknown>;
}> => {
  const mapped = map(outcome.data);
  const mappedData = pruneUndefined({ ...mapped.standard, ...mapped.cognism });

  if (!shouldPersist) {
    return { mappedData, persistData: {} };
  }

  const writableStandard = pickWritableStandard({
    standard: mapped.standard,
    current: node as unknown as Record<string, unknown>,
    emptyChecks,
    overrideExistingValues,
  });

  const extraPersistData = await buildExtraPersistData?.();

  const persistData = pruneUndefined<unknown>({
    ...writableStandard,
    ...mapped.cognism,
    ...extraPersistData,
    cognismMatchScore: outcome.matchScore,
    cognismRawPayload: outcome.data,
    cognismLastEnrichedAt: enrichedAt,
    cognismEnrichmentStatus: 'MATCHED',
  });

  return { mappedData, persistData };
};
