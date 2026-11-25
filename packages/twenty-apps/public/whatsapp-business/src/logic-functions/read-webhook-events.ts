import { z } from 'zod';
import { defineLogicFunction } from 'twenty-sdk/define';
import { type InputJsonSchema } from 'twenty-sdk/logic-function';
import { WHATSAPP_LOGIC_FUNCTION_READ_WEBHOOK_EVENTS_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { readWhatsAppWebhookEvents } from 'src/logic-functions/data/read-whatsapp-webhook-events.util';

const READ_WEBHOOK_EVENTS_MAX_LIMIT = 100;

const readWebhookEventsParamsSchema = z.object({
  includeRead: z.boolean().default(false),
  limit: z.number().int().min(1).max(READ_WEBHOOK_EVENTS_MAX_LIMIT).default(20),
  markAsRead: z.boolean().default(true),
});

const READ_WEBHOOK_EVENTS_INPUT_SCHEMA: InputJsonSchema = {
  type: 'object',
  properties: {
    includeRead: {
      type: 'boolean',
      label: 'Include read',
      description: 'Also return events that were already read. Defaults to false, which returns unread events only.',
    },
    limit: {
      type: 'number',
      label: 'Limit',
      description: `Maximum number of events to return, oldest first, up to ${READ_WEBHOOK_EVENTS_MAX_LIMIT}. Defaults to 20.`,
    },
    markAsRead: {
      type: 'boolean',
      label: 'Mark as read',
      description: 'Mark the returned events as read. Defaults to true.',
    },
  },
  additionalProperties: false,
};

const handler = async (rawParams: unknown) => {
  const parsedParams = readWebhookEventsParamsSchema.safeParse(rawParams ?? {});

  if (!parsedParams.success) {
    throw new Error(z.prettifyError(parsedParams.error));
  }

  return { events: await readWhatsAppWebhookEvents(parsedParams.data) };
};

export default defineLogicFunction({
  universalIdentifier: WHATSAPP_LOGIC_FUNCTION_READ_WEBHOOK_EVENTS_UNIVERSAL_IDENTIFIER,
  name: 'read-webhook-events',
  description:
    'Read the stored WhatsApp webhook events, oldest first. Returns unread events by default and marks the returned events as read.',
  timeoutSeconds: 30,
  handler,
  toolTriggerSettings: { inputSchema: READ_WEBHOOK_EVENTS_INPUT_SCHEMA },
});
