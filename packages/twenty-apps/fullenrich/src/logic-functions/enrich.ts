import { defineLogicFunction, RoutePayload } from 'twenty-sdk/define';
import { ENRICH_FUNCTION_PATH } from "src/constants/universal-identifiers";

// Fullenrich limit: 100 records in request, 60 req/min
// Twenty limit: 50/100 req/min

// Logic function handler - rename and implement your logic
const handler = async (params: RoutePayload<{recordIds?: []}>): Promise<{ message: string }> => {
  const { a, b } = params;

  // Replace with your own logic
  const message = `Hello, input: ${a} and ${b}`;

  return { message };
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
