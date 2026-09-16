import { APOLLO_COMPANY_NO_IDENTIFIER_MESSAGE } from 'src/constants/enrichment-messages.constant';
import { type BulkEnrichmentAdapter } from 'src/logic-functions/types/bulk-enrichment-adapter.type';
import { type CompanyRecord } from 'src/logic-functions/types/company-record.type';
import { fetchApolloOrganizationsBulk } from 'src/logic-functions/utils/fetch-apollo-organizations-bulk';
import {
  buildCompanyApolloData,
  buildCompanyStandardData,
} from 'src/logic-functions/utils/map-organization';
import { readCompanies } from 'src/logic-functions/utils/read-companies';
import { updateCompaniesStatus } from 'src/logic-functions/utils/update-companies-status';
import { updateCompanyRecord } from 'src/logic-functions/utils/update-company-record';
import { normalizeDomain } from '../data/normalize-domain';

export const companyBulkEnrichmentAdapter: BulkEnrichmentAdapter<
  CompanyRecord,
  string
> = {
  objectNameSingular: 'Company',
  noIdentifierMessage: APOLLO_COMPANY_NO_IDENTIFIER_MESSAGE,
  notFoundMessage: 'Apollo returned no organization for this record.',
  readRecords: readCompanies,
  buildMatchParams: (company) =>
    normalizeDomain(company.domainName?.primaryLinkUrl),
  fetchMatches: ({ params, accessToken }) =>
    fetchApolloOrganizationsBulk({ domains: params, accessToken }),
  buildData: ({ match, enrichedAt }) => ({
    ...buildCompanyStandardData(match),
    ...buildCompanyApolloData({ organization: match, enrichedAt }),
  }),
  updateRecord: updateCompanyRecord,
  updateManyStatus: updateCompaniesStatus,
};
