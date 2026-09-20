import { isEmptyAddress } from 'src/logic-functions/utils/is-empty-address';
import { isEmptyCurrency } from 'src/logic-functions/utils/is-empty-currency';
import { isEmptyLinks } from 'src/logic-functions/utils/is-empty-links';
import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';
import { mapCompany } from 'src/logic-functions/utils/map-company';
import { pickWritableStandard } from 'src/logic-functions/utils/pick-writable-standard';
import { type CompanyNode } from 'src/types/company-node';
import { type RocketReachCompanyData } from 'src/types/rocketreach-company-data';
import { pruneUndefined } from 'src/logic-functions/utils/prune-undefined';

const COMPANY_EMPTY_CHECKS = {
  name: isEmptyText,
  domainName: isEmptyLinks,
  linkedinLink: isEmptyLinks,
  address: isEmptyAddress,
  annualRevenue: isEmptyCurrency,
};

export const buildCompanyMatchedData = ({
  node,
  data,
  enrichedAt,
  overrideExistingValues,
  shouldPersist,
}: {
  node: CompanyNode;
  data: RocketReachCompanyData;
  enrichedAt: string;
  overrideExistingValues: boolean;
  shouldPersist: boolean;
}): {
  mappedData: Record<string, unknown>;
  persistData: Record<string, unknown>;
} => {
  const mapped = mapCompany(data);
  const mappedData = pruneUndefined({
    ...mapped.standard,
    ...mapped.rocketReach,
  });

  if (!shouldPersist) {
    return { mappedData, persistData: {} };
  }

  const writableStandard = pickWritableStandard({
    standard: mapped.standard,
    current: node as unknown as Record<string, unknown>,
    emptyChecks: COMPANY_EMPTY_CHECKS,
    overrideExistingValues,
  });

  const persistData = pruneUndefined({
    ...writableStandard,
    ...mapped.rocketReach,
    rocketReachRawPayload: data,
    rocketReachLastEnrichedAt: enrichedAt,
    rocketReachEnrichmentStatus: 'MATCHED',
  });

  return { mappedData, persistData };
};
