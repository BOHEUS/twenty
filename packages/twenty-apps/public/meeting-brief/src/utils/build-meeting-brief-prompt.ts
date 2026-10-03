import { type PendingMeetingBrief } from 'src/types/meeting-brief.type';

export const buildMeetingBriefPrompt = ({
  meeting,
  crmAttendees,
}: Pick<PendingMeetingBrief, 'meeting' | 'crmAttendees'>): string => {
  const attendeeLines = crmAttendees.map(
    (attendee) =>
      `- ${attendee.displayName ?? attendee.handle ?? 'Unknown'}${
        attendee.handle ? ` <${attendee.handle}>` : ''
      } (person id: ${attendee.personId})`,
  );

  return [
    `Meeting: ${meeting.title ?? 'Untitled meeting'}`,
    `Starts at: ${meeting.startsAt}`,
    `Calendar event id: ${meeting.id}`,
    'CRM people attending:',
    ...attendeeLines,
  ].join('\n');
};
