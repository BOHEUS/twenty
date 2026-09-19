import { buildPersonMatchedData } from 'src/logic-functions/utils/build-person-matched-data';
import { enrichContacts } from 'src/logic-functions/utils/enrich-contacts';
import { extractContactMatchInput } from 'src/logic-functions/utils/extract-contact-match-input';
import { preloadCompanyIdsByMatchKey } from 'src/logic-functions/utils/preload-company-ids-by-match-key';
import { readPeople } from 'src/logic-functions/utils/read-people';
import { updatePeopleStatus } from 'src/logic-functions/utils/update-people-status';
import { updatePersonRecord } from 'src/logic-functions/utils/update-person-record';
import { type BatchEnrichmentAdapter } from 'src/types/batch-enrichment-adapter';
import { type PersonNode } from 'src/types/person-node';
import { type ZoomInfoContactData } from 'src/types/zoominfo-contact-data';
import { type ZoomInfoContactMatchInput } from 'src/types/zoominfo-contact-match-input';
import { isDefined } from 'twenty-sdk/utils';

export const personEnrichmentAdapter: BatchEnrichmentAdapter<
  PersonNode,
  ZoomInfoContactData,
  ZoomInfoContactMatchInput
> = {
  objectNameSingular: 'Person',
  noIdentifierMessage:
    'No usable identifier (email, LinkedIn, or name with an employer) to match against ZoomInfo.',
  readRecords: readPeople,
  getNodeId: (node) => node.id,
  extractMatchInput: extractContactMatchInput,
  enrichBatch: enrichContacts,
  preloadMatchedRelations: ({
    client,
    matchedData,
    companyIdByMatchKeyCache,
  }) =>
    preloadCompanyIdsByMatchKey({
      client,
      companies: matchedData
        .map((contactData) => contactData.company)
        .filter(isDefined),
      companyIdByMatchKeyCache,
    }),
  buildMatchedData: buildPersonMatchedData,
  updateOne: updatePersonRecord,
  updateManyStatus: updatePeopleStatus,
};
