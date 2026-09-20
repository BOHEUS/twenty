import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachPersonalEmail,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'rocketReachPersonalEmail',
  label: 'Personal Email',
  description: 'Recommended personal email returned by RocketReach.',
  icon: 'IconMail',
  isNullable: true,
});
