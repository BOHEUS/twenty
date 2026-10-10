import { buildCompanyMatchedData } from 'src/logic-functions/utils/build-company-matched-data';
import { enrichCompanies } from 'src/logic-functions/utils/enrich-companies';
import { extractCompanyMatchParams } from 'src/logic-functions/utils/extract-company-match-params';
import { readCompanies } from 'src/logic-functions/utils/read-companies';
import { updateCompaniesStatus } from 'src/logic-functions/utils/update-companies-status';
import { updateCompanyRecord } from 'src/logic-functions/utils/update-company-record';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type CompanyNode } from 'src/types/company-node';
import { type SnovCompanyData } from 'src/types/snov-company-data';

export const companyEnrichmentAdapter: BatchEnrichmentAdapter<
  CompanyNode,
  SnovCompanyData,
  string
> = {
  objectNameSingular: 'Company',
  noIdentifierMessage: 'No company domain to search on Snov.io.',
  readRecords: readCompanies,
  getNodeId: (node) => node.id,
  extractParams: extractCompanyMatchParams,
  enrichBatch: enrichCompanies,
  buildMatchedData: ({
    node,
    outcome,
    enrichedAt,
    overrideExistingValues,
    shouldPersist,
  }) =>
    buildCompanyMatchedData({
      node,
      outcome,
      enrichedAt,
      overrideExistingValues,
      shouldPersist,
    }),
  updateOne: updateCompanyRecord,
  updateManyStatus: updateCompaniesStatus,
};
