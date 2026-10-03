import { describe, expect, it } from 'vitest';

import { type MeetingParticipant } from 'src/types/meeting-brief.type';
import { selectPendingMeetingBriefs } from 'src/utils/select-pending-meeting-briefs';

const MEETING = {
  id: 'event-1',
  title: 'Intro call',
  startsAt: '2026-10-03T10:00:00.000Z',
};

const NOW = new Date('2026-10-03T09:30:00.000Z');

const buildParticipant = (
  overrides: Partial<MeetingParticipant>,
): MeetingParticipant => ({
  id: 'participant',
  calendarEventId: MEETING.id,
  personId: null,
  workspaceMemberId: null,
  displayName: null,
  handle: null,
  responseStatus: 'ACCEPTED',
  meetingBriefStartsAt: null,
  meetingBriefPendingSince: null,
  ...overrides,
});

const PROSPECT = buildParticipant({ id: 'prospect', personId: 'person-1' });
const TEAMMATE = buildParticipant({
  id: 'teammate',
  workspaceMemberId: 'member-1',
});

describe('selectPendingMeetingBriefs', () => {
  it('briefs each attending teammate when a CRM person attends', () => {
    expect(
      selectPendingMeetingBriefs({
        meetings: [MEETING],
        participants: [PROSPECT, TEAMMATE],
        now: NOW,
        limit: 10,
      }),
    ).toEqual([
      { meeting: MEETING, recipient: TEAMMATE, crmAttendees: [PROSPECT] },
    ]);
  });

  it('skips internal meetings without CRM people', () => {
    expect(
      selectPendingMeetingBriefs({
        meetings: [MEETING],
        participants: [
          TEAMMATE,
          buildParticipant({ id: 'unknown', handle: 'someone@example.com' }),
        ],
        now: NOW,
        limit: 10,
      }),
    ).toEqual([]);
  });

  it('skips teammates who declined', () => {
    expect(
      selectPendingMeetingBriefs({
        meetings: [MEETING],
        participants: [
          PROSPECT,
          { ...TEAMMATE, responseStatus: 'DECLINED' },
        ],
        now: NOW,
        limit: 10,
      }),
    ).toEqual([]);
  });

  it('skips teammates already briefed for this start time', () => {
    expect(
      selectPendingMeetingBriefs({
        meetings: [MEETING],
        participants: [
          PROSPECT,
          { ...TEAMMATE, meetingBriefStartsAt: '2026-10-03T10:00:00Z' },
        ],
        now: NOW,
        limit: 10,
      }),
    ).toEqual([]);
  });

  it('waits while another run holds a recent claim', () => {
    expect(
      selectPendingMeetingBriefs({
        meetings: [MEETING],
        participants: [
          PROSPECT,
          {
            ...TEAMMATE,
            meetingBriefStartsAt: MEETING.startsAt,
            meetingBriefPendingSince: '2026-10-03T09:25:00.000Z',
          },
        ],
        now: NOW,
        limit: 10,
      }),
    ).toEqual([]);
  });

  it('retries a claim that stayed pending past the retry delay', () => {
    const staleClaim = {
      ...TEAMMATE,
      meetingBriefStartsAt: MEETING.startsAt,
      meetingBriefPendingSince: '2026-10-03T09:10:00.000Z',
    };

    expect(
      selectPendingMeetingBriefs({
        meetings: [MEETING],
        participants: [PROSPECT, staleClaim],
        now: NOW,
        limit: 10,
      }),
    ).toEqual([
      { meeting: MEETING, recipient: staleClaim, crmAttendees: [PROSPECT] },
    ]);
  });

  it('briefs again when the meeting was rescheduled', () => {
    const briefedForOldTime = {
      ...TEAMMATE,
      meetingBriefStartsAt: '2026-10-03T09:00:00.000Z',
    };

    expect(
      selectPendingMeetingBriefs({
        meetings: [MEETING],
        participants: [PROSPECT, briefedForOldTime],
        now: NOW,
        limit: 10,
      }),
    ).toEqual([
      {
        meeting: MEETING,
        recipient: briefedForOldTime,
        crmAttendees: [PROSPECT],
      },
    ]);
  });

  it('stops at the limit', () => {
    const secondTeammate = buildParticipant({
      id: 'teammate-2',
      workspaceMemberId: 'member-2',
    });

    expect(
      selectPendingMeetingBriefs({
        meetings: [MEETING],
        participants: [PROSPECT, TEAMMATE, secondTeammate],
        now: NOW,
        limit: 1,
      }),
    ).toHaveLength(1);
  });
});
