import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction } from 'twenty-sdk/define';
import { runAgent, sendInboxMessage } from 'twenty-sdk/logic-function';

import {
  MAX_MEETING_BRIEFS_PER_RUN,
  MEETING_BRIEF_CRON_INTERVAL_MINUTES,
  MEETING_BRIEF_LEAD_TIME_MINUTES,
  SEND_MEETING_BRIEFS_TIMEOUT_SECONDS,
} from 'src/constants/meeting-brief-schedule';
import {
  MEETING_BRIEF_AGENT_UNIVERSAL_IDENTIFIER,
  SEND_MEETING_BRIEFS_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';
import {
  type MeetingParticipant,
  type PendingMeetingBrief,
  type UpcomingMeeting,
} from 'src/types/meeting-brief.type';
import { buildMeetingBriefPrompt } from 'src/utils/build-meeting-brief-prompt';
import { selectPendingMeetingBriefs } from 'src/utils/select-pending-meeting-briefs';

const QUERY_MAX_RECORDS = 200;

const fetchUpcomingMeetings = async (
  client: CoreApiClient,
  now: Date,
): Promise<UpcomingMeeting[]> => {
  const windowEnd = new Date(
    now.getTime() + MEETING_BRIEF_LEAD_TIME_MINUTES * 60 * 1000,
  );
  const meetings: UpcomingMeeting[] = [];
  let after: string | undefined;

  do {
    const { calendarEvents } = await client.query({
      calendarEvents: {
        __args: {
          filter: {
            and: [
              { startsAt: { gt: now.toISOString() } },
              { startsAt: { lte: windowEnd.toISOString() } },
              { isCanceled: { eq: false } },
            ],
          },
          orderBy: [{ startsAt: 'AscNullsLast' }],
          first: QUERY_MAX_RECORDS,
          after,
        },
        edges: { node: { id: true, title: true, startsAt: true } },
        pageInfo: { hasNextPage: true, endCursor: true },
      },
    });

    meetings.push(
      ...(calendarEvents?.edges ?? []).map(
        (edge: { node: UpcomingMeeting }) => edge.node,
      ),
    );

    after = calendarEvents?.pageInfo.hasNextPage
      ? (calendarEvents.pageInfo.endCursor ?? undefined)
      : undefined;
  } while (after);

  return meetings;
};

const fetchMeetingParticipants = async (
  client: CoreApiClient,
  meetingIds: string[],
): Promise<MeetingParticipant[]> => {
  const participants: MeetingParticipant[] = [];
  let after: string | undefined;

  do {
    const { calendarEventParticipants } = await client.query({
      calendarEventParticipants: {
        __args: {
          filter: { calendarEventId: { in: meetingIds } },
          first: QUERY_MAX_RECORDS,
          after,
        },
        edges: {
          node: {
            id: true,
            calendarEventId: true,
            personId: true,
            workspaceMemberId: true,
            displayName: true,
            handle: true,
            responseStatus: true,
            meetingBriefStartsAt: true,
            meetingBriefPendingSince: true,
          },
        },
        pageInfo: { hasNextPage: true, endCursor: true },
      },
    });

    participants.push(
      ...(calendarEventParticipants?.edges ?? []).map(
        (edge: { node: MeetingParticipant }) => edge.node,
      ),
    );

    after = calendarEventParticipants?.pageInfo.hasNextPage
      ? (calendarEventParticipants.pageInfo.endCursor ?? undefined)
      : undefined;
  } while (after);

  return participants;
};

const toDateTimeFilter = (value: string | null) =>
  value === null ? { is: 'NULL' } : { eq: value };

// Compare-and-set on the attendee's brief state so overlapping runs never prepare the same brief twice.
const claimBrief = async (
  client: CoreApiClient,
  { meeting, recipient }: Pick<PendingMeetingBrief, 'meeting' | 'recipient'>,
  claimedAt: string,
): Promise<boolean> => {
  const result = await client.mutation({
    updateCalendarEventParticipants: {
      __args: {
        filter: {
          id: { eq: recipient.id },
          meetingBriefStartsAt: toDateTimeFilter(
            recipient.meetingBriefStartsAt,
          ),
          meetingBriefPendingSince: toDateTimeFilter(
            recipient.meetingBriefPendingSince,
          ),
        },
        data: {
          meetingBriefStartsAt: meeting.startsAt,
          meetingBriefPendingSince: claimedAt,
        },
      },
      id: true,
    },
  });

  return (result.updateCalendarEventParticipants ?? []).length > 0;
};

const markBriefDelivered = async (
  client: CoreApiClient,
  { recipient }: Pick<PendingMeetingBrief, 'recipient'>,
  claimedAt: string,
): Promise<void> => {
  await client.mutation({
    updateCalendarEventParticipants: {
      __args: {
        filter: {
          id: { eq: recipient.id },
          meetingBriefPendingSince: { eq: claimedAt },
        },
        data: { meetingBriefPendingSince: null },
      },
      id: true,
    },
  });
};

const hasTextResponse = (
  result: object | null,
): result is { response: string } =>
  result !== null &&
  'response' in result &&
  typeof result.response === 'string' &&
  result.response.trim().length > 0;

// A failed brief keeps its pending claim, so it is retried once the claim is old enough.
const sendMeetingBrief = async (
  client: CoreApiClient,
  pendingBrief: PendingMeetingBrief,
  now: Date,
): Promise<void> => {
  const { meeting, recipient, crmAttendees } = pendingBrief;
  const claimedAt = now.toISOString();

  if (!(await claimBrief(client, pendingBrief, claimedAt))) {
    return;
  }

  const agentResult = await runAgent({
    agentUniversalIdentifier: MEETING_BRIEF_AGENT_UNIVERSAL_IDENTIFIER,
    runAsWorkspaceMemberId: recipient.workspaceMemberId,
    prompt: buildMeetingBriefPrompt({ meeting, crmAttendees }),
  });

  if (!agentResult.success || !hasTextResponse(agentResult.result)) {
    throw new Error(agentResult.error ?? 'Agent returned an empty brief');
  }

  await sendInboxMessage({
    workspaceMemberId: recipient.workspaceMemberId,
    threadKey: `meeting-brief:${meeting.id}`,
    idempotencyKey: `${meeting.id}:${meeting.startsAt}`,
    title: `Brief: ${meeting.title ?? 'Upcoming meeting'}`,
    text: agentResult.result.response,
  });

  await markBriefDelivered(client, pendingBrief, claimedAt);
};

const handler = async (): Promise<void> => {
  const client = new CoreApiClient();
  const now = new Date();

  const meetings = await fetchUpcomingMeetings(client, now);

  if (meetings.length === 0) {
    return;
  }

  const participants = await fetchMeetingParticipants(
    client,
    meetings.map((meeting) => meeting.id),
  );

  const pendingBriefs = selectPendingMeetingBriefs({
    meetings,
    participants,
    now,
    limit: MAX_MEETING_BRIEFS_PER_RUN,
  });

  for (const pendingBrief of pendingBriefs) {
    try {
      await sendMeetingBrief(client, pendingBrief, now);
    } catch (error) {
      console.error(
        `Meeting brief failed for calendar event ${pendingBrief.meeting.id}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
};

export default defineLogicFunction({
  universalIdentifier: SEND_MEETING_BRIEFS_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
  name: 'send-meeting-briefs',
  description:
    'Sends each attending workspace member an AI brief before upcoming meetings with CRM people, and again if the meeting is rescheduled.',
  timeoutSeconds: SEND_MEETING_BRIEFS_TIMEOUT_SECONDS,
  cronTriggerSettings: {
    pattern: `*/${MEETING_BRIEF_CRON_INTERVAL_MINUTES} * * * *`,
  },
  handler,
});
