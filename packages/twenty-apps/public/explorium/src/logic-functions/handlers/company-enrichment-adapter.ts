import { buildCompanyMatchedData } from 'src/logic-functions/utils/build-company-matched-data';
import { enrichCompanies } from 'src/logic-functions/utils/enrich-companies';
import { extractCompanyMatchParams } from 'src/logic-functions/utils/extract-company-match-params';
import { readCompanies } from 'src/logic-functions/utils/read-companies';
import { updateCompaniesStatus } from 'src/logic-functions/utils/update-companies-status';
import { updateCompanyRecord } from 'src/logic-functions/utils/update-company-record';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type CompanyNode } from 'src/types/company-node';
import { type ExploriumCompanyData } from 'src/types/explorium-company-data';
import { type ExploriumBusinessMatchInput } from 'src/types/explorium-match-inputs';
import { type ExploriumMatchParams } from 'src/types/explorium-match-params';

export const companyEnrichmentAdapter: BatchEnrichmentAdapter<
  CompanyNode,
  ExploriumCompanyData,
  ExploriumMatchParams<ExploriumBusinessMatchInput>
> = {
  objectNameSingular: 'Company',
  noIdentifierMessage:
    'No usable identifier (domain or LinkedIn) to match against Explorium.',
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
