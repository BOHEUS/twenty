import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { queryMock, mutationMock, runAgentMock, sendInboxMessageMock } =
  vi.hoisted(() => ({
    queryMock: vi.fn(),
    mutationMock: vi.fn(),
    runAgentMock: vi.fn(),
    sendInboxMessageMock: vi.fn(),
  }));

vi.mock('twenty-client-sdk/core', () => ({
  CoreApiClient: vi.fn(function () {
    return { query: queryMock, mutation: mutationMock };
  }),
}));

vi.mock('twenty-sdk/logic-function', () => ({
  runAgent: runAgentMock,
  sendInboxMessage: sendInboxMessageMock,
}));

import sendMeetingBriefs from '../send-meeting-briefs';

const handler = sendMeetingBriefs.config.handler as () => Promise<void>;

const NOW = '2026-10-03T09:30:00.000Z';
const STARTS_AT = '2026-10-03T10:00:00.000Z';
const BRIEF = '## From your CRM\n- Ada works at Acme';

const singlePage = (nodes: Record<string, unknown>[]) => ({
  edges: nodes.map((node) => ({ node })),
  pageInfo: { hasNextPage: false, endCursor: null },
});

const participant = (overrides: Record<string, unknown>) => ({
  calendarEventId: 'event-1',
  personId: null,
  workspaceMemberId: null,
  displayName: null,
  handle: null,
  responseStatus: 'ACCEPTED',
  meetingBriefStartsAt: null,
  meetingBriefPendingSince: null,
  ...overrides,
});

const mockParticipants = (teammates: Record<string, unknown>[]) =>
  queryMock.mockImplementation((query) => {
    if (query.calendarEvents) {
      return Promise.resolve({
        calendarEvents: singlePage([
          { id: 'event-1', title: 'Intro call', startsAt: STARTS_AT },
        ]),
      });
    }

    return Promise.resolve({
      calendarEventParticipants: singlePage([
        participant({
          id: 'prospect',
          personId: 'person-1',
          displayName: 'Ada',
          handle: 'ada@acme.com',
        }),
        ...teammates.map(participant),
      ]),
    });
  });

const getParticipantUpdates = () =>
  mutationMock.mock.calls.map(
    ([mutation]) => mutation.updateCalendarEventParticipants.__args,
  );

const successfulAgentRun = {
  success: true,
  error: null,
  result: { response: BRIEF },
};

describe('send-meeting-briefs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));

    mockParticipants([{ id: 'teammate', workspaceMemberId: 'member-1' }]);
    mutationMock.mockResolvedValue({
      updateCalendarEventParticipants: [{ id: 'teammate' }],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('claims the attendee, sends the brief as the teammate, then clears the claim', async () => {
    runAgentMock.mockResolvedValue(successfulAgentRun);

    await handler();

    expect(getParticipantUpdates()).toEqual([
      {
        filter: {
          id: { eq: 'teammate' },
          meetingBriefStartsAt: { is: 'NULL' },
          meetingBriefPendingSince: { is: 'NULL' },
        },
        data: { meetingBriefStartsAt: STARTS_AT, meetingBriefPendingSince: NOW },
      },
      {
        filter: { id: { eq: 'teammate' }, meetingBriefPendingSince: { eq: NOW } },
        data: { meetingBriefPendingSince: null },
      },
    ]);
    expect(runAgentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        runAsWorkspaceMemberId: 'member-1',
        prompt: expect.stringContaining('person id: person-1'),
      }),
    );
    expect(sendInboxMessageMock).toHaveBeenCalledWith({
      workspaceMemberId: 'member-1',
      threadKey: 'meeting-brief:event-1',
      idempotencyKey: `event-1:${STARTS_AT}`,
      title: 'Brief: Intro call',
      text: BRIEF,
    });
  });

  it('does not run the agent when another run already claimed the attendee', async () => {
    mutationMock.mockResolvedValue({ updateCalendarEventParticipants: [] });

    await handler();

    expect(runAgentMock).not.toHaveBeenCalled();
    expect(sendInboxMessageMock).not.toHaveBeenCalled();
  });

  it('keeps a failed brief pending and still briefs the next teammate', async () => {
    mockParticipants([
      { id: 'teammate', workspaceMemberId: 'member-1' },
      { id: 'teammate-2', workspaceMemberId: 'member-2' },
    ]);
    runAgentMock
      .mockResolvedValueOnce({
        success: false,
        error: 'Agent stopped: no more available credits.',
        result: null,
      })
      .mockResolvedValueOnce(successfulAgentRun);

    await handler();

    expect(sendInboxMessageMock).toHaveBeenCalledTimes(1);
    expect(sendInboxMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({ workspaceMemberId: 'member-2' }),
    );
    expect(
      getParticipantUpdates().filter(
        ({ filter, data }) =>
          filter.id.eq === 'teammate' && data.meetingBriefPendingSince === null,
      ),
    ).toEqual([]);
  });

  it('keeps going when a claim write throws', async () => {
    mockParticipants([
      { id: 'teammate', workspaceMemberId: 'member-1' },
      { id: 'teammate-2', workspaceMemberId: 'member-2' },
    ]);
    mutationMock
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue({
        updateCalendarEventParticipants: [{ id: 'teammate-2' }],
      });
    runAgentMock.mockResolvedValue(successfulAgentRun);

    await handler();

    expect(sendInboxMessageMock).toHaveBeenCalledTimes(1);
    expect(sendInboxMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({ workspaceMemberId: 'member-2' }),
    );
  });
});
