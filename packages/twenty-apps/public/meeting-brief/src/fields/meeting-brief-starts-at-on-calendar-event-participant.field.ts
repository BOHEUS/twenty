import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { MEETING_BRIEF_STARTS_AT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: MEETING_BRIEF_STARTS_AT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventParticipant
      .universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'meetingBriefStartsAt',
  label: 'Meeting brief prepared for',
  description:
    'Start time of the meeting the app last prepared a brief for this attendee. A rescheduled meeting gets a new brief.',
  icon: 'IconSparkles',
  isNullable: true,
  isAuditLogged: false,
});
