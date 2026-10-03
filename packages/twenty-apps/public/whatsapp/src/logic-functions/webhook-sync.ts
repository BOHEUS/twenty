import { defineLogicFunction, RoutePayload } from 'twenty-sdk/define';
import { WhatsAppWebhookMessage } from 'src/logic-functions/types/whatsapp-webhook-message.type';
import { validateWebhookPayload } from 'src/logic-functions/data/validate-webhook-payload.util';
import { enqueueJobs } from "twenty-sdk/logic-function";

const handler = async (
  params: RoutePayload<WhatsAppWebhookMessage>,
): Promise<object> => {
  if (!process.env.WEBHOOK_VALIDATION_SECRET || !process.env.ACCESS_TOKEN) {
    return {
      success: false,
    };
  }

  const { rawBody, body, headers } = params;
  if (rawBody === undefined || body === null || body?.entry === undefined || body.object !== 'whatsapp_business_account') {
    return {
      success: false,
    };
  }

  const signature = headers['x-hub-signature-256'];
  if (!signature || signature === '') {
    return {
      success: false,
    };
  }

  if (
    !validateWebhookPayload(
      signature,
      rawBody,
      process.env.WEBHOOK_VALIDATION_SECRET,
    )
  ) {
    return {
      success: false,
    };
  }

  for (const entry of body.entry) {
    for (const change of entry.changes) {
      if ('messages' in change.value) {
        for (const message of change.value.messages) {
          await enqueueJobs({
            logicFunctionUniversalIdentifier: '8aa95b71-dffe-4232-8fdd-c4aeba2aedd0', retryLimit: 3, delayMs: 500, jobs: [{
              payload: {
                businessData: change.value.metadata, contacts: change.value.contacts[0], messages: message
              }
            }]
          })
        }
      }
    }
  }
  return {
    success: true,
  };
};

export default defineLogicFunction({
  universalIdentifier: '845183d7-da92-4810-afd3-4f35c3b941e3',
  name: 'webhook-sync',
  description: 'Add a description for your logic function',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: '/whatsapp',
    httpMethod: 'POST',
    isAuthRequired: false,
    forwardedRequestHeaders: ['x-hub-signature-256']
  },
});
