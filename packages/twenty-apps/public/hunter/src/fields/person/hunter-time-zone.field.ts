import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { HUNTER_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterTimeZone,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'hunterTimeZone',
  label: 'Time Zone',
  description: 'Time zone returned by Hunter.',
  icon: 'IconClock',
  isNullable: true,
});
