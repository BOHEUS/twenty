import { isEmptyAddress } from 'src/logic-functions/utils/is-empty-address';
import { isEmptyLinks } from 'src/logic-functions/utils/is-empty-links';
import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';
import { mapCompany } from 'src/logic-functions/utils/map-company';
import { pickWritableStandard } from 'src/logic-functions/utils/pick-writable-standard';
import { type CompanyNode } from 'src/types/company-node';
import { type SnovCompanyData } from 'src/types/snov-company-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

const COMPANY_EMPTY_CHECKS = {
  name: isEmptyText,
  domainName: isEmptyLinks,
  linkedinLink: isEmptyLinks,
  address: isEmptyAddress,
};

export const buildCompanyMatchedData = async ({
  node,
  outcome,
  enrichedAt,
  overrideExistingValues,
  shouldPersist,
}: {
  node: CompanyNode;
  outcome: { data: SnovCompanyData };
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
    ...mapped.snov,
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
    ...mapped.snov,
    snovRawPayload: outcome.data,
    snovLastEnrichedAt: enrichedAt,
    snovEnrichmentStatus: 'MATCHED',
  });

  return { mappedData, persistData };
};
