import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_LINKEDIN_CONNECTION_COUNT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_LINKEDIN_CONNECTION_COUNT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'linkedinConnectionCount',
  type: FieldType.NUMBER,
  label: 'LinkedIn connections',
  description:
    'Connection count on the professional network profile.',
  icon: 'IconUsers',
  isNullable: true,
  isUIEditable: false,
});
