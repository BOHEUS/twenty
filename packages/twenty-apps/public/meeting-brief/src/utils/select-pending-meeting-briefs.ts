import { DECLINED_RESPONSE_STATUS } from 'src/constants/declined-response-status';
import { MEETING_BRIEF_RETRY_AFTER_MINUTES } from 'src/constants/meeting-brief-schedule';
import {
  type MeetingBriefRecipient,
  type MeetingParticipant,
  type PendingMeetingBrief,
  type UpcomingMeeting,
} from 'src/types/meeting-brief.type';

const isSameInstant = (left: string | null, right: string): boolean =>
  left !== null && new Date(left).getTime() === new Date(right).getTime();

const isBriefDue = (
  participant: MeetingParticipant,
  meeting: UpcomingMeeting,
  now: Date,
): boolean => {
  if (!isSameInstant(participant.meetingBriefStartsAt, meeting.startsAt)) {
    return true;
  }

  return (
    participant.meetingBriefPendingSince !== null &&
    now.getTime() - new Date(participant.meetingBriefPendingSince).getTime() >=
      MEETING_BRIEF_RETRY_AFTER_MINUTES * 60 * 1000
  );
};

export const selectPendingMeetingBriefs = ({
  meetings,
  participants,
  now,
  limit,
}: {
  meetings: UpcomingMeeting[];
  participants: MeetingParticipant[];
  now: Date;
  limit: number;
}): PendingMeetingBrief[] => {
  const participantsByMeetingId = new Map<string, MeetingParticipant[]>();

  for (const participant of participants) {
    const meetingParticipants =
      participantsByMeetingId.get(participant.calendarEventId) ?? [];

    meetingParticipants.push(participant);
    participantsByMeetingId.set(
      participant.calendarEventId,
      meetingParticipants,
    );
  }

  const pendingBriefs: PendingMeetingBrief[] = [];

  for (const meeting of meetings) {
    const meetingParticipants = participantsByMeetingId.get(meeting.id) ?? [];

    const crmAttendees = meetingParticipants.filter(
      (participant) =>
        participant.personId !== null && participant.workspaceMemberId === null,
    );

    if (crmAttendees.length === 0) {
      continue;
    }

    const recipients = meetingParticipants.filter(
      (participant): participant is MeetingBriefRecipient =>
        participant.workspaceMemberId !== null &&
        participant.responseStatus !== DECLINED_RESPONSE_STATUS &&
        isBriefDue(participant, meeting, now),
    );

    for (const recipient of recipients) {
      if (pendingBriefs.length >= limit) {
        return pendingBriefs;
      }

      pendingBriefs.push({ meeting, recipient, crmAttendees });
    }
  }

  return pendingBriefs;
};
