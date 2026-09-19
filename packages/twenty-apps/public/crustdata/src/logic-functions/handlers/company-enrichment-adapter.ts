import { buildCompanyMatchedData } from 'src/logic-functions/utils/build-company-matched-data';
import { enrichCompanies } from 'src/logic-functions/utils/enrich-companies';
import { extractCompanyMatchParams } from 'src/logic-functions/utils/extract-company-match-params';
import { readCompanies } from 'src/logic-functions/utils/read-companies';
import { updateCompaniesStatus } from 'src/logic-functions/utils/update-companies-status';
import { updateCompanyRecord } from 'src/logic-functions/utils/update-company-record';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type CompanyEnrichParams } from 'src/types/company-enrich-params';
import { type CompanyNode } from 'src/types/company-node';
import { type CrustdataCompanyData } from 'src/types/crustdata-company-data';

export const companyEnrichmentAdapter: BatchEnrichmentAdapter<
  CompanyNode,
  CrustdataCompanyData,
  CompanyEnrichParams
> = {
  objectNameSingular: 'Company',
  noIdentifierMessage:
    'No domain, LinkedIn URL, Crustdata ID or name on this record to match against Crustdata.',
  resourceContext: 'crustdata/company',
  readRecords: readCompanies,
  getNodeId: (node) => node.id,
  extractParams: extractCompanyMatchParams,
  enrichBatch: enrichCompanies,
  buildMatchedData: buildCompanyMatchedData,
  updateOne: updateCompanyRecord,
  updateManyStatus: updateCompaniesStatus,
};
