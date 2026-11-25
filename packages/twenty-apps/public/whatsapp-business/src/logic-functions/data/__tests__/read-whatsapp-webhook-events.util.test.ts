import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readWhatsAppWebhookEvents } from 'src/logic-functions/data/read-whatsapp-webhook-events.util';

const query = vi.fn();
const mutation = vi.fn();

vi.mock('twenty-client-sdk/core', () => ({
  CoreApiClient: class {
    query = query;
    mutation = mutation;
  },
}));

const UNREAD_EVENT = { id: 'unread', createdAt: '2026-11-25T10:00:00.000Z', webhookFields: 'messages', payload: {}, isRead: false };
const READ_EVENT = { id: 'read', createdAt: '2026-11-25T09:00:00.000Z', webhookFields: 'statuses', payload: {}, isRead: true };

const getQueryFilter = () => query.mock.calls[0]?.[0].whatsAppWebhookEvents.__args.filter;

const mockEvents = (events: object[]) =>
  query.mockResolvedValue({ whatsAppWebhookEvents: { edges: events.map((node) => ({ node })) } });

describe('readWhatsAppWebhookEvents', () => {
  beforeEach(() => {
    query.mockReset();
    mutation.mockReset();
  });

  it('should return unread events only and mark them as read', async () => {
    mockEvents([UNREAD_EVENT]);

    const events = await readWhatsAppWebhookEvents({ includeRead: false, limit: 20, markAsRead: true });

    expect(events).toEqual([UNREAD_EVENT]);
    expect(getQueryFilter()).toEqual({ isRead: { eq: false } });
    expect(mutation).toHaveBeenCalledWith({
      updateWhatsAppWebhookEvents: {
        __args: { filter: { id: { in: ['unread'] } }, data: { isRead: true } },
        id: true,
      },
    });
  });

  it('should include read events without marking them again', async () => {
    mockEvents([READ_EVENT, UNREAD_EVENT]);

    const events = await readWhatsAppWebhookEvents({ includeRead: true, limit: 20, markAsRead: true });

    expect(events).toEqual([READ_EVENT, UNREAD_EVENT]);
    expect(getQueryFilter()).toBeUndefined();
    expect(mutation).toHaveBeenCalledWith({
      updateWhatsAppWebhookEvents: {
        __args: { filter: { id: { in: ['unread'] } }, data: { isRead: true } },
        id: true,
      },
    });
  });

  it('should leave events unread when asked not to mark them', async () => {
    mockEvents([UNREAD_EVENT]);

    await readWhatsAppWebhookEvents({ includeRead: false, limit: 20, markAsRead: false });

    expect(mutation).not.toHaveBeenCalled();
  });
});
