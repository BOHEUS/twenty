import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LUSHA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaLastEnrichedAt,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'lushaLastEnrichedAt',
  label: 'Lusha Last Enriched',
  description: 'When this person was last enriched with Lusha.',
  icon: 'IconClock',
  isNullable: true,
});
