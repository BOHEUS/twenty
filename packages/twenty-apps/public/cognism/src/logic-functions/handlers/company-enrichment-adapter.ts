import { COMPANY_REDEEM_COST_DOLLARS } from 'src/constants/company-redeem-cost-dollars';
import { buildCompanyMatchedData } from 'src/logic-functions/utils/build-company-matched-data';
import { enrichCompanies } from 'src/logic-functions/utils/enrich-companies';
import { extractCompanyMatchParams } from 'src/logic-functions/utils/extract-company-match-params';
import { readCompanies } from 'src/logic-functions/utils/read-companies';
import { updateCompaniesStatus } from 'src/logic-functions/utils/update-companies-status';
import { updateCompanyRecord } from 'src/logic-functions/utils/update-company-record';
import { type BatchEnrichmentAdapter } from 'src/logic-functions/types/batch-enrichment-adapter';
import { type CompanyNode } from 'src/logic-functions/types/company-node';
import { type CognismCompanyData } from 'src/logic-functions/types/cognism-company-data';
import { type CognismCompanyEnrichParams } from 'src/logic-functions/types/cognism-company-enrich-params';

export const companyEnrichmentAdapter: BatchEnrichmentAdapter<
  CompanyNode,
  CognismCompanyData,
  CognismCompanyEnrichParams
> = {
  objectNameSingular: 'Company',
  noIdentifierMessage:
    'No usable identifier (domain, LinkedIn, or name) to match against Cognism.',
  costPerRedeemDollars: COMPANY_REDEEM_COST_DOLLARS,
  readRecords: readCompanies,
  extractParams: extractCompanyMatchParams,
  enrichBatch: enrichCompanies,
  buildMatchedData: buildCompanyMatchedData,
  updateOne: updateCompanyRecord,
  updateManyStatus: updateCompaniesStatus,
};
