import { defineLogicFunction, RoutePayload } from 'twenty-sdk/define';
import {
  type WhatsAppPhoneNumberNameUpdateValue,
  WhatsAppWebhook
} from 'src/logic-functions/types/whatsapp-webhook-message.type';
import { validateWebhookPayload } from 'src/logic-functions/data/validate-webhook-payload.util';
import { enqueueJobs, updateMessageChannel } from "twenty-sdk/logic-function";
import { WHATSAPP_LOGIC_FUNCTION_PARSE_MESSAGE_UNIVERSAL_IDENTIFIER } from "src/constants/universal-identifiers";
import { updateTwentyMessageChannel } from "src/logic-functions/data/update-message-channel.util";
import { sendInboxNotification } from "src/logic-functions/data/send-inbox-notification.util";

const handler = async (
  params: RoutePayload<WhatsAppWebhook>,
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
      switch (change.field) {
        case "account_alerts":
          if ('a' in change.value)
            break;
        case "account_review_update":
        case "account_update":
        case "automatic_events":
        case "business_capability_update":
        case "history":
        case "message_template_components_update":
        case "message_template_quality_update":
        case "message_template_status_update":
        case "partner_solutions":
        case "payment_configuration_update":
        case "phone_number_name_update":
          if ('a' in change.value){
            await updateTwentyMessageChannel();
          }
          break;
        case "phone_number_quality_update":
          await sendInboxNotification();
          break;
        case "security":
        case "smb_app_state_sync":
        case "smb_message_echoes":

        case "template_category_update":
          await sendInboxNotification();
          break;
        case "user_preferences":
          return {
            success: false,
          }
        case "messages": {
          if ('errors' in change.value){
            return {
              success: false,
            }
          }
          if ('statuses' in change.value) {
            return {
              success: false,
            }
          }
          if ('messages' in change.value) {
            await enqueueJobs({
              logicFunctionUniversalIdentifier: WHATSAPP_LOGIC_FUNCTION_PARSE_MESSAGE_UNIVERSAL_IDENTIFIER,
              retryLimit: 3,
              delayMs: 500,
              jobs: [{
                payload: {
                  businessData: change.value.metadata, contacts: change.value.contacts[0], messages: change.value.messages,
                }
              }]
            })
          }
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
