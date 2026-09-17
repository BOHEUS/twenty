import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LUSHA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaLocation,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.ADDRESS,
  name: 'lushaLocation',
  label: 'Lusha Location',
  description: 'Where Lusha places this person.',
  icon: 'IconMapPin',
  isNullable: true,
});
