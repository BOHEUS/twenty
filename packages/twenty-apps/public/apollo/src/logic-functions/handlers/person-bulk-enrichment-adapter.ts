import { APOLLO_PERSON_NO_IDENTIFIER_MESSAGE } from 'src/constants/enrichment-messages.constant';
import { type BulkEnrichmentAdapter } from 'src/logic-functions/types/bulk-enrichment-adapter.type';
import { type PersonRecord } from 'src/logic-functions/types/person-record.type';
import { buildPersonMatchParams } from 'src/logic-functions/utils/build-person-match-params';
import { fetchApolloPeopleBulk } from 'src/logic-functions/utils/fetch-apollo-people-bulk';
import { type ApolloPersonMatchParams } from 'src/logic-functions/utils/fetch-apollo-person';
import {
  buildPersonApolloData,
  buildPersonStandardData,
} from 'src/logic-functions/utils/map-person';
import { readPeople } from 'src/logic-functions/utils/read-people';
import { updatePeopleStatus } from 'src/logic-functions/utils/update-people-status';
import { updatePersonRecord } from 'src/logic-functions/utils/update-person-record';

export const personBulkEnrichmentAdapter: BulkEnrichmentAdapter<
  PersonRecord,
  ApolloPersonMatchParams
> = {
  objectNameSingular: 'Person',
  noIdentifierMessage: APOLLO_PERSON_NO_IDENTIFIER_MESSAGE,
  notFoundMessage: 'Apollo returned no person for this record.',
  readRecords: readPeople,
  buildMatchParams: buildPersonMatchParams,
  fetchMatches: fetchApolloPeopleBulk,
  buildData: ({ match, enrichedAt }) => ({
    ...buildPersonStandardData(match),
    ...buildPersonApolloData({ person: match, enrichedAt }),
  }),
  updateRecord: updatePersonRecord,
  updateManyStatus: updatePeopleStatus,
};
