import { defineLogicFunction, RoutePayload } from 'twenty-sdk/define';
import { Response } from 'twenty-sdk/logic-function';

const handler = async (params: RoutePayload) => {
  if (process.env.VERIFY_TOKEN === params.queryStringParameters["hub.verify_token"]) {
    // get connected account
    // get message channels
    return new Response(params.queryStringParameters["hub.challenge"], {
      status: 200,
    });
  } else {
    return new Response('', {
      status: 400,
    })
  }
};

export default defineLogicFunction({
  universalIdentifier: '9cdee7d8-34c7-4f98-aab1-5f509886b02f',
  name: 'initial-webhook-test',
  description: 'Endpoint used to validate webhooks by Meta',
  timeoutSeconds: 5,
  handler,
  httpRouteTriggerSettings: {
    path: '/whatsapp',
    httpMethod: 'GET',
    isAuthRequired: false,
  },
});
