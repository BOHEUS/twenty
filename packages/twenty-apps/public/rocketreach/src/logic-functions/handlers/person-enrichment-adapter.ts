import { buildPersonMatchedData } from 'src/logic-functions/utils/build-person-matched-data';
import { countPersonLookupCredits } from 'src/logic-functions/utils/count-person-lookup-credits';
import { extractPersonMatchParams } from 'src/logic-functions/utils/extract-person-match-params';
import { lookupPeople } from 'src/logic-functions/utils/lookup-people';
import { readPeople } from 'src/logic-functions/utils/read-people';
import { updatePeopleStatus } from 'src/logic-functions/utils/update-people-status';
import { updatePersonRecord } from 'src/logic-functions/utils/update-person-record';
import { type EnrichmentAdapter } from 'src/types/enrichment-adapter';
import { type PersonNode } from 'src/types/person-node';
import { type RocketReachPersonData } from 'src/types/rocketreach-person-data';
import { type RocketReachPersonLookupParams } from 'src/types/rocketreach-person-lookup-params';

export const personEnrichmentAdapter: EnrichmentAdapter<
  PersonNode,
  RocketReachPersonData,
  RocketReachPersonLookupParams
> = {
  objectNameSingular: 'Person',
  noIdentifierMessage:
    'No usable identifier (email, LinkedIn URL, RocketReach id, or name paired with a company) to look up in RocketReach.',
  countCreditsPerMatch: countPersonLookupCredits,
  readRecords: readPeople,
  getNodeId: (node) => node.id,
  extractParams: extractPersonMatchParams,
  lookupMany: lookupPeople,
  buildMatchedData: buildPersonMatchedData,
  updateOne: updatePersonRecord,
  updateManyStatus: updatePeopleStatus,
};
