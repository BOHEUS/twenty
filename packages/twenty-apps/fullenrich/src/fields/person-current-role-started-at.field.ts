import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_CURRENT_ROLE_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_CURRENT_ROLE_STARTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'currentRoleStartedAt',
  type: FieldType.DATE_TIME,
  label: 'Current role started',
  description:
    'Start date of the current position. Surfaced separately from employment history so it can be filtered and sorted.',
  icon: 'IconCalendarPlus',
  isNullable: true,
  isUIEditable: false,
});
