import { LOOKUP_CREDIT_COSTS } from 'src/constants/lookup-credit-costs';
import { buildCompanyMatchedData } from 'src/logic-functions/utils/build-company-matched-data';
import { extractCompanyMatchParams } from 'src/logic-functions/utils/extract-company-match-params';
import { lookupCompanies } from 'src/logic-functions/utils/lookup-companies';
import { readCompanies } from 'src/logic-functions/utils/read-companies';
import { updateCompaniesStatus } from 'src/logic-functions/utils/update-companies-status';
import { updateCompanyRecord } from 'src/logic-functions/utils/update-company-record';
import { type CompanyNode } from 'src/types/company-node';
import { type EnrichmentAdapter } from 'src/types/enrichment-adapter';
import { type RocketReachCompanyData } from 'src/types/rocketreach-company-data';
import { type RocketReachCompanyLookupParams } from 'src/types/rocketreach-company-lookup-params';

export const companyEnrichmentAdapter: EnrichmentAdapter<
  CompanyNode,
  RocketReachCompanyData,
  RocketReachCompanyLookupParams
> = {
  objectNameSingular: 'Company',
  noIdentifierMessage:
    'No usable identifier (domain, LinkedIn URL, RocketReach id, or name) to look up in RocketReach.',
  countCreditsPerMatch: () => LOOKUP_CREDIT_COSTS.companyEnrichment,
  readRecords: readCompanies,
  getNodeId: (node) => node.id,
  extractParams: extractCompanyMatchParams,
  lookupMany: ({ params }) => lookupCompanies({ params }),
  buildMatchedData: async ({
    node,
    data,
    enrichedAt,
    overrideExistingValues,
    shouldPersist,
  }) =>
    buildCompanyMatchedData({
      node,
      data,
      enrichedAt,
      overrideExistingValues,
      shouldPersist,
    }),
  updateOne: updateCompanyRecord,
  updateManyStatus: updateCompaniesStatus,
};
