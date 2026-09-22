import { isNonEmptyString } from '@sniptt/guards';
import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { enqueueJobs } from 'twenty-sdk/logic-function';

import { FULLENRICH_MAX_CONTACTS_PER_REQUEST } from 'src/constants/fullenrich-api';
import {
  ENRICH_BATCH_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
  ENRICH_FUNCTION_PATH,
} from 'src/constants/universal-identifiers';
import { buildWebhookUrl } from 'src/logic-functions/shared/build-webhook-url';
import { getFullEnrichApiKey } from 'src/logic-functions/shared/get-application-variables';
import { chunk } from 'src/logic-functions/utils/chunk.util';

const BATCH_SIZE = FULLENRICH_MAX_CONTACTS_PER_REQUEST;

const RETRY_LIMIT = 3;

const handler = async (
  params: RoutePayload<{ recordIds?: string[] }>,
): Promise<object> => {
  const recordIds = [
    ...new Set(params.body?.recordIds?.filter(isNonEmptyString) ?? []),
  ];

  if (recordIds.length === 0) {
    return { error: 'No record ids were given to enrich.' };
  }

  const apiKeyResult = getFullEnrichApiKey();
  if (!apiKeyResult.success) {
    return { error: apiKeyResult.error };
  }

  const webhookUrlResult = buildWebhookUrl();
  if (!webhookUrlResult.success) {
    return { error: webhookUrlResult.error };
  }

  const batches = chunk({ items: recordIds, size: BATCH_SIZE });

  const { enqueuedJobsCount } = await enqueueJobs({
    logicFunctionUniversalIdentifier:
      ENRICH_BATCH_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
    jobs: batches.map((batch) => ({ payload: { recordIds: batch } })),
    retryLimit: RETRY_LIMIT,
  });

  console.log(
    `Enqueued ${enqueuedJobsCount} enrichment batch job(s) for ${recordIds.length} record(s).`,
  );

  return { recordCount: recordIds.length, enqueuedJobsCount };
};

export default defineLogicFunction({
  universalIdentifier: '6b54dcc0-17a1-47c5-a746-dce5158f8c0e',
  name: 'enrich',
  description:
    'Splits the selected people into batches and enqueues a background job per batch',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: ENRICH_FUNCTION_PATH,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
