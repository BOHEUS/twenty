import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LUSHA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaDataUpdatedAt,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.DATE,
  name: 'lushaDataUpdatedAt',
  label: 'Lusha Data Updated',
  description: 'When Lusha last updated this contact.',
  icon: 'IconCalendarTime',
  isNullable: true,
});
