import { defineObject, FieldType } from 'twenty-sdk/define';
import {
  WHATSAPP_WEBHOOK_EVENT_FIELD_UNIVERSAL_IDENTIFIERS,
  WHATSAPP_WEBHOOK_EVENT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineObject({
  universalIdentifier: WHATSAPP_WEBHOOK_EVENT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'whatsAppWebhookEvent',
  namePlural: 'whatsAppWebhookEvents',
  labelSingular: 'WhatsApp webhook event',
  labelPlural: 'WhatsApp webhook events',
  description: 'A verified webhook received from WhatsApp, kept as received so it can be read again if processing missed it',
  icon: 'IconWebhook',
  labelIdentifierFieldMetadataUniversalIdentifier: WHATSAPP_WEBHOOK_EVENT_FIELD_UNIVERSAL_IDENTIFIERS.fields,
  fields: [
    {
      universalIdentifier: WHATSAPP_WEBHOOK_EVENT_FIELD_UNIVERSAL_IDENTIFIERS.fields,
      type: FieldType.TEXT,
      name: 'fields',
      label: 'Fields',
      description: 'Webhook fields of the changes in the payload, such as messages or account_alerts',
      icon: 'IconTag',
      isUIEditable: false,
    },
    {
      universalIdentifier: WHATSAPP_WEBHOOK_EVENT_FIELD_UNIVERSAL_IDENTIFIERS.payload,
      type: FieldType.RAW_JSON,
      name: 'payload',
      label: 'Payload',
      description: 'Webhook body as sent by Meta',
      icon: 'IconCode',
      isNullable: true,
      isUIEditable: false,
    },
    {
      universalIdentifier: WHATSAPP_WEBHOOK_EVENT_FIELD_UNIVERSAL_IDENTIFIERS.isRead,
      type: FieldType.BOOLEAN,
      name: 'isRead',
      label: 'Read',
      description: 'Whether the event was returned by the read-webhook-events function',
      icon: 'IconEye',
      defaultValue: false,
    },
  ],
});
