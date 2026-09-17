import { isDefined } from 'twenty-sdk/utils';

import {
  LUSHA_PERSON_NO_IDENTIFIER_MESSAGE,
  LUSHA_PERSON_NOT_FOUND_MESSAGE,
} from 'src/constants/enrichment-messages.constant';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';
import { type EnrichmentAdapter } from 'src/logic-functions/types/enrichment-adapter.type';
import { type LushaContactSearchItem } from 'src/logic-functions/types/lusha-search-item.type';
import { type PersonRecord } from 'src/logic-functions/types/person-record.type';
import { buildPersonSearchItem } from 'src/logic-functions/utils/build-person-search-item';
import {
  buildPersonLushaData,
  buildPersonStandardData,
} from 'src/logic-functions/utils/build-person-update-data';
import { callLushaApi } from 'src/logic-functions/utils/call-lusha-api';
import { findOrCreateCompany } from 'src/logic-functions/utils/find-or-create-company';
import { readPeople } from 'src/logic-functions/utils/read-people';

export const personEnrichmentAdapter: EnrichmentAdapter<
  PersonRecord,
  LushaContactSearchItem
> = {
  objectNameSingular: 'Person',
  noIdentifierMessage: LUSHA_PERSON_NO_IDENTIFIER_MESSAGE,
  notFoundMessage: LUSHA_PERSON_NOT_FOUND_MESSAGE,
  fieldNamesDroppableOnWriteFailure: ['emails', 'phones'],
  readRecords: readPeople,
  buildSearchItem: buildPersonSearchItem,
  searchAndEnrich: ({ apiKey, items, revealPhones }) =>
    callLushaApi({
      path: '/contacts/search-and-enrich',
      apiKey,
      body: {
        contacts: items,
        reveal: revealPhones ? ['emails', 'phones'] : ['emails'],
      },
    }),
  buildUpdateData: async ({
    client,
    record,
    match,
    enrichedAt,
    companyIdByDomain,
  }) => {
    // Linking the employer is a bonus: failing it must not throw away the
    // contact data Lusha already charged for.
    const companyId = isDefined(record.company?.id)
      ? undefined
      : await findOrCreateCompany({
          client,
          contact: match,
          companyIdByDomain,
        }).catch(() => undefined);

    return {
      ...buildPersonStandardData({ person: record, contact: match }),
      ...pruneUndefined({ companyId }),
      ...buildPersonLushaData({ contact: match, enrichedAt }),
    };
  },
  updateRecord: async ({ client, recordId, data }) => {
    await client.mutation({
      updatePerson: { __args: { id: recordId, data }, id: true },
    });
  },
  updateManyStatus: async ({ client, recordIds, data }) => {
    await client.mutation({
      updatePeople: {
        __args: { filter: { id: { in: recordIds } }, data },
        id: true,
      },
    });
  },
};
