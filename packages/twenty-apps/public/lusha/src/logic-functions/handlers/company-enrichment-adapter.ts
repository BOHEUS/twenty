import {
  LUSHA_COMPANY_NO_IDENTIFIER_MESSAGE,
  LUSHA_COMPANY_NOT_FOUND_MESSAGE,
} from 'src/constants/enrichment-messages.constant';
import { type CompanyRecord } from 'src/logic-functions/types/company-record.type';
import { type EnrichmentAdapter } from 'src/logic-functions/types/enrichment-adapter.type';
import { type LushaCompanySearchItem } from 'src/logic-functions/types/lusha-search-item.type';
import { buildCompanySearchItem } from 'src/logic-functions/utils/build-company-search-item';
import {
  buildCompanyLushaData,
  buildCompanyStandardData,
} from 'src/logic-functions/utils/build-company-update-data';
import { callLushaApi } from 'src/logic-functions/utils/call-lusha-api';
import { readCompanies } from 'src/logic-functions/utils/read-companies';

export const companyEnrichmentAdapter: EnrichmentAdapter<
  CompanyRecord,
  LushaCompanySearchItem
> = {
  objectNameSingular: 'Company',
  noIdentifierMessage: LUSHA_COMPANY_NO_IDENTIFIER_MESSAGE,
  notFoundMessage: LUSHA_COMPANY_NOT_FOUND_MESSAGE,
  fieldNamesDroppableOnWriteFailure: ['lushaPhones'],
  readRecords: readCompanies,
  buildSearchItem: buildCompanySearchItem,
  searchAndEnrich: ({ apiKey, items }) =>
    callLushaApi({
      path: '/companies/search-and-enrich',
      apiKey,
      body: { companies: items, options: { includePartialProfiles: true } },
    }),
  buildUpdateData: async ({ record, match, enrichedAt }) => ({
    ...buildCompanyStandardData({ company: record, lushaCompany: match }),
    ...buildCompanyLushaData({ lushaCompany: match, enrichedAt }),
  }),
  updateRecord: async ({ client, recordId, data }) => {
    await client.mutation({
      updateCompany: { __args: { id: recordId, data }, id: true },
    });
  },
  updateManyStatus: async ({ client, recordIds, data }) => {
    await client.mutation({
      updateCompanies: {
        __args: { filter: { id: { in: recordIds } }, data },
        id: true,
      },
    });
  },
};
