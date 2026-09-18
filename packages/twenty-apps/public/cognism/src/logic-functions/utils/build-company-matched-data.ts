import { buildMatchedData } from 'src/logic-functions/utils/build-matched-data';
import { isEmptyComposite } from 'src/logic-functions/utils/is-empty-composite';
import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';
import { mapCompany } from 'src/logic-functions/utils/map-company';
import { type CompanyNode } from 'src/logic-functions/types/company-node';
import { type CognismCompanyData } from 'src/logic-functions/types/cognism-company-data';

const COMPANY_EMPTY_CHECKS = {
  name: isEmptyText,
  domainName: isEmptyComposite('primaryLinkUrl'),
  linkedinLink: isEmptyComposite('primaryLinkUrl'),
  address: isEmptyComposite(
    'addressStreet1',
    'addressStreet2',
    'addressCity',
    'addressPostcode',
    'addressState',
    'addressCountry',
  ),
};

export const buildCompanyMatchedData = ({
  node,
  outcome,
  enrichedAt,
  overrideExistingValues,
  shouldPersist,
}: {
  node: CompanyNode;
  outcome: { matchScore?: number; data: CognismCompanyData };
  enrichedAt: string;
  overrideExistingValues: boolean;
  shouldPersist: boolean;
}): Promise<{
  mappedData: Record<string, unknown>;
  persistData: Record<string, unknown>;
}> =>
  buildMatchedData({
    node,
    outcome,
    enrichedAt,
    overrideExistingValues,
    shouldPersist,
    map: mapCompany,
    emptyChecks: COMPANY_EMPTY_CHECKS,
  });
