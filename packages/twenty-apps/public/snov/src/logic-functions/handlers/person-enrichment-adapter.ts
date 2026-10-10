import { buildPersonMatchedData } from 'src/logic-functions/utils/build-person-matched-data';
import { enrichPeople } from 'src/logic-functions/utils/enrich-people';
import { extractPersonMatchParams } from 'src/logic-functions/utils/extract-person-match-params';
import { readPeople } from 'src/logic-functions/utils/read-people';
import { updatePeopleStatus } from 'src/logic-functions/utils/update-people-status';
import { updatePersonRecord } from 'src/logic-functions/utils/update-person-record';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type PersonNode } from 'src/types/person-node';
import { type SnovPersonData } from 'src/types/snov-person-data';
import { type SnovPersonMatchParams } from 'src/types/snov-person-match-params';

export const personEnrichmentAdapter: BatchEnrichmentAdapter<
  PersonNode,
  SnovPersonData,
  SnovPersonMatchParams
> = {
  objectNameSingular: 'Person',
  noIdentifierMessage:
    'No usable identifier (email, LinkedIn, or first and last name with a company domain) to look up on Snov.io.',
  readRecords: readPeople,
  getNodeId: (node) => node.id,
  extractParams: extractPersonMatchParams,
  enrichBatch: enrichPeople,
  buildMatchedData: buildPersonMatchedData,
  updateOne: updatePersonRecord,
  updateManyStatus: updatePeopleStatus,
};
