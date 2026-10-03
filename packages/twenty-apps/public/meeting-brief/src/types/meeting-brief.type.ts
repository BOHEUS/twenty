export type UpcomingMeeting = {
  id: string;
  title: string | null;
  startsAt: string;
};

export type MeetingParticipant = {
  id: string;
  calendarEventId: string;
  personId: string | null;
  workspaceMemberId: string | null;
  displayName: string | null;
  handle: string | null;
  responseStatus: string | null;
  meetingBriefStartsAt: string | null;
  meetingBriefPendingSince: string | null;
};

export type MeetingBriefRecipient = MeetingParticipant & {
  workspaceMemberId: string;
};

export type PendingMeetingBrief = {
  meeting: UpcomingMeeting;
  recipient: MeetingBriefRecipient;
  crmAttendees: MeetingParticipant[];
};
