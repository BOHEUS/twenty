import { buildCompanyMatchedData } from 'src/logic-functions/utils/build-company-matched-data';
import { enrichCompanies } from 'src/logic-functions/utils/enrich-companies';
import { extractCompanyMatchInput } from 'src/logic-functions/utils/extract-company-match-input';
import { readCompanies } from 'src/logic-functions/utils/read-companies';
import { updateCompaniesStatus } from 'src/logic-functions/utils/update-companies-status';
import { updateCompanyRecord } from 'src/logic-functions/utils/update-company-record';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type CompanyNode } from 'src/types/company-node';
import { type ZoomInfoCompanyData } from 'src/types/zoominfo-company-data';
import { type ZoomInfoCompanyMatchInput } from 'src/types/zoominfo-company-match-input';

export const companyEnrichmentAdapter: BatchEnrichmentAdapter<
  CompanyNode,
  ZoomInfoCompanyData,
  ZoomInfoCompanyMatchInput
> = {
  objectNameSingular: 'Company',
  noIdentifierMessage:
    'No usable identifier (domain or name) to match against ZoomInfo.',
  readRecords: readCompanies,
  getNodeId: (node) => node.id,
  extractMatchInput: extractCompanyMatchInput,
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
