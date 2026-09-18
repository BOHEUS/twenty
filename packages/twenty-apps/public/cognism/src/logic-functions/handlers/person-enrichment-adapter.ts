import { PERSON_REDEEM_COST_DOLLARS } from 'src/constants/person-redeem-cost-dollars';
import { buildPersonMatchedData } from 'src/logic-functions/utils/build-person-matched-data';
import { enrichPeople } from 'src/logic-functions/utils/enrich-people';
import { extractPersonMatchParams } from 'src/logic-functions/utils/extract-person-match-params';
import { readPeople } from 'src/logic-functions/utils/read-people';
import { updatePeopleStatus } from 'src/logic-functions/utils/update-people-status';
import { updatePersonRecord } from 'src/logic-functions/utils/update-person-record';
import { type BatchEnrichmentAdapter } from 'src/logic-functions/types/batch-enrichment-adapter';
import { type CognismPersonData } from 'src/logic-functions/types/cognism-person-data';
import { type CognismPersonEnrichParams } from 'src/logic-functions/types/cognism-person-enrich-params';
import { type PersonNode } from 'src/logic-functions/types/person-node';

export const personEnrichmentAdapter: BatchEnrichmentAdapter<
  PersonNode,
  CognismPersonData,
  CognismPersonEnrichParams
> = {
  objectNameSingular: 'Person',
  noIdentifierMessage:
    'No usable identifier (email, LinkedIn, Cognism id, or name paired with a company) to match against Cognism.',
  costPerRedeemDollars: PERSON_REDEEM_COST_DOLLARS,
  readRecords: readPeople,
  extractParams: extractPersonMatchParams,
  enrichBatch: enrichPeople,
  buildMatchedData: buildPersonMatchedData,
  updateOne: updatePersonRecord,
  updateManyStatus: updatePeopleStatus,
};
