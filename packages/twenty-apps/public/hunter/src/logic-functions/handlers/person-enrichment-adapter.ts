import { buildPersonMatchedData } from 'src/logic-functions/utils/build-person-matched-data';
import { enrichPeople } from 'src/logic-functions/utils/enrich-people';
import { extractPersonMatchParams } from 'src/logic-functions/utils/extract-person-match-params';
import { readPeople } from 'src/logic-functions/utils/read-people';
import { updatePeopleStatus } from 'src/logic-functions/utils/update-people-status';
import { updatePersonRecord } from 'src/logic-functions/utils/update-person-record';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type HunterPersonData } from 'src/types/hunter-person-data';
import { type HunterPersonMatchParams } from 'src/types/hunter-person-match-params';
import { type PersonNode } from 'src/types/person-node';

export const personEnrichmentAdapter: BatchEnrichmentAdapter<
  PersonNode,
  HunterPersonData,
  HunterPersonMatchParams
> = {
  objectNameSingular: 'Person',
  noIdentifierMessage:
    'No usable identifier (email, LinkedIn, or first and last name with a company) to look up on Hunter.',
  readRecords: readPeople,
  getNodeId: (node) => node.id,
  extractParams: extractPersonMatchParams,
  enrichBatch: enrichPeople,
  buildMatchedData: buildPersonMatchedData,
  updateOne: updatePersonRecord,
  updateManyStatus: updatePeopleStatus,
};
