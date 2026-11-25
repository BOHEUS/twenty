import { CoreApiClient } from 'twenty-client-sdk/core';
import { type WhatsAppWebhook } from 'src/logic-functions/types/whatsapp-webhook-message.type';

export const storeWhatsAppWebhookEvent = async (webhook: WhatsAppWebhook) => {
  const webhookFields = [...new Set(webhook.entry.flatMap(({ changes }) => changes.map(({ field }) => field)))];

  await new CoreApiClient().mutation({
    createWhatsAppWebhookEvent: {
      __args: { data: { webhookFields: webhookFields.join(', '), payload: webhook, isRead: false } },
      id: true,
    },
  });
};
