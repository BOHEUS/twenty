import { CoreApiClient } from 'twenty-client-sdk/core';

type WhatsAppWebhookEvent = {
  id: string;
  createdAt: string;
  fields: string | null;
  payload: unknown;
  isRead: boolean;
};

export const readWhatsAppWebhookEvents = async ({
  includeRead,
  limit,
  markAsRead,
}: {
  includeRead: boolean;
  limit: number;
  markAsRead: boolean;
}): Promise<WhatsAppWebhookEvent[]> => {
  const client = new CoreApiClient();

  const { whatsAppWebhookEvents } = await client.query({
    whatsAppWebhookEvents: {
      __args: {
        ...(includeRead ? {} : { filter: { isRead: { eq: false } } }),
        orderBy: [{ createdAt: 'AscNullsLast' }],
        first: limit,
      },
      edges: { node: { id: true, createdAt: true, fields: true, payload: true, isRead: true } },
    },
  });

  const events: WhatsAppWebhookEvent[] = (whatsAppWebhookEvents?.edges ?? []).map(
    ({ node }: { node: WhatsAppWebhookEvent }) => node,
  );
  const unreadEventIds = events.filter(({ isRead }) => !isRead).map(({ id }) => id);

  if (markAsRead && unreadEventIds.length > 0) {
    await client.mutation({
      updateWhatsAppWebhookEvents: {
        __args: { filter: { id: { in: unreadEventIds } }, data: { isRead: true } },
        id: true,
      },
    });
  }

  return events;
};
