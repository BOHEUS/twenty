import { buildPersonMatchedData } from 'src/logic-functions/utils/build-person-matched-data';
import { enrichPeople } from 'src/logic-functions/utils/enrich-people';
import { extractPersonMatchParams } from 'src/logic-functions/utils/extract-person-match-params';
import { readPeople } from 'src/logic-functions/utils/read-people';
import { updatePeopleStatus } from 'src/logic-functions/utils/update-people-status';
import { updatePersonRecord } from 'src/logic-functions/utils/update-person-record';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type DropcontactMatchParams } from 'src/types/dropcontact-match-params';
import { type DropcontactPersonData } from 'src/types/dropcontact-person-data';
import { type PersonNode } from 'src/types/person-node';

export const personEnrichmentAdapter: BatchEnrichmentAdapter<
  PersonNode,
  DropcontactPersonData,
  DropcontactMatchParams
> = {
  objectNameSingular: 'Person',
  noIdentifierMessage:
    'No usable identifier (email, LinkedIn, or first and last name with a company) to send to Dropcontact.',
  readRecords: readPeople,
  getNodeId: (node) => node.id,
  extractParams: extractPersonMatchParams,
  enrichBatch: enrichPeople,
  buildMatchedData: buildPersonMatchedData,
  updateOne: updatePersonRecord,
  updateManyStatus: updatePeopleStatus,
};
