import { defineLogicFunction, RoutePayload } from 'twenty-sdk/define';
import { ENRICH_FUNCTION_PATH } from "src/constants/universal-identifiers";
import { chunk } from "src/logic-functions/utils/chunk.util";

// Fullenrich limit: 100 records in request, 60 req/min, 15 min = 90000 records queued
// Twenty limit: 50/100 req/min * 200 records * 15 min = 150000-300000 records

const handler = async (params: RoutePayload<{recordIds?: string[]}>) => {
  const recordIds = params.body?.recordIds;

  if (recordIds === undefined || recordIds.length === 0) {
    console.warn("");
    return;
  }
  // no need to worry about enrichment req limits as the limit is 150k/300k records capped by Twenty req limit (50|100*200*15)
  for (const records of chunk({items: recordIds, size: 200})) {
    const fetchedRecords = await fetchData()
  }
};

export default defineLogicFunction({
  universalIdentifier: '6b54dcc0-17a1-47c5-a746-dce5158f8c0e',
  name: 'enrich',
  description: 'Add a description for your logic function',
  timeoutSeconds: 900,
  handler,
  httpRouteTriggerSettings: {
    path: ENRICH_FUNCTION_PATH,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
