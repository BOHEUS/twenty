import { isNonEmptyString } from '@sniptt/guards';
import { defineLogicFunction } from 'twenty-sdk/define';

import { ENRICH_BATCH_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { fetchTwentyPeople } from 'src/logic-functions/data/fetch-records.util';
import {
  enrichPeople,
  type EnrichPeopleResult,
} from 'src/logic-functions/shared/enrich-people';

const handler = async (payload: {
  recordIds?: string[];
}): Promise<EnrichPeopleResult> => {
  const recordIds = payload?.recordIds?.filter(isNonEmptyString) ?? [];

  if (recordIds.length === 0) {
    throw new Error('Enrichment batch job received no record ids.');
  }

  const people = await fetchTwentyPeople(recordIds);
  const result = await enrichPeople({ people });

  console.log(
    `Enrichment batch of ${recordIds.length} record(s): ${result.submitted} sent to FullEnrich, ${result.skipped} skipped.`,
  );

  return result;
};

export default defineLogicFunction({
  universalIdentifier: ENRICH_BATCH_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
  name: 'enrich-batch',
  description:
    'Sends one enqueued batch of people to FullEnrich in a single bulk request',
  timeoutSeconds: 300,
  handler,
});
