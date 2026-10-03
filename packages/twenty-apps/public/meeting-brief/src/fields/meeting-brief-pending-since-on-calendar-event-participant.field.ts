import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { MEETING_BRIEF_PENDING_SINCE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: MEETING_BRIEF_PENDING_SINCE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventParticipant
      .universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'meetingBriefPendingSince',
  label: 'Meeting brief pending since',
  description:
    'When the app last started preparing a brief for this attendee. Cleared once the brief is delivered; a brief still pending after a while is retried.',
  icon: 'IconSparkles',
  isNullable: true,
  isAuditLogged: false,
});
