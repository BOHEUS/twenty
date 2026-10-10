import { COMPANY_EMPTY_CHECKS } from 'src/logic-functions/utils/company-empty-checks';
import { mapCompany } from 'src/logic-functions/utils/map-company';
import { pickWritableStandard } from 'src/logic-functions/utils/pick-writable-standard';
import { type CompanyNode } from 'src/types/company-node';
import { type HunterCompany } from 'src/types/hunter-company';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyMatchedData = async ({
  node,
  outcome,
  enrichedAt,
  overrideExistingValues,
  shouldPersist,
}: {
  node: CompanyNode;
  outcome: { data: HunterCompany };
  enrichedAt: string;
  overrideExistingValues: boolean;
  shouldPersist: boolean;
}): Promise<{
  mappedData: Record<string, unknown>;
  persistData: Record<string, unknown>;
}> => {
  const mapped = mapCompany(outcome.data);
  const mappedData = pruneUndefined({
    ...mapped.standard,
    ...mapped.hunter,
  });

  if (!shouldPersist) {
    return { mappedData, persistData: {} };
  }

  const writableStandard = pickWritableStandard({
    standard: mapped.standard,
    current: node,
    emptyChecks: COMPANY_EMPTY_CHECKS,
    overrideExistingValues,
  });

  const persistData = pruneUndefined({
    ...writableStandard,
    ...mapped.hunter,
    hunterRawPayload: outcome.data,
    hunterLastEnrichedAt: enrichedAt,
    hunterEnrichmentStatus: 'MATCHED',
  });

  return { mappedData, persistData };
};
