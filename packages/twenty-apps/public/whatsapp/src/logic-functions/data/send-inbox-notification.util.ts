import { sendInboxMessage } from 'twenty-sdk/logic-function';
import {
  type WhatsAppWebhookMessageContacts,
  type WhatsAppWebhookMessageContent,
} from 'src/logic-functions/types/whatsapp-webhook-message.type';

type SendInboxNotificationParams = {
  workspaceMemberId: string;
  contact: WhatsAppWebhookMessageContacts;
  message: WhatsAppWebhookMessageContent;
  text: string;
};

export const sendInboxNotification = async ({
  workspaceMemberId,
  contact,
  message,
  text,
}: SendInboxNotificationParams) =>
  sendInboxMessage({
    workspaceMemberId,
    threadKey: message.group_id ?? message.from,
    idempotencyKey: message.id,
    title: contact.profile.name,
    text,
  });
