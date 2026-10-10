import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumLocation,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.ADDRESS,
  name: 'exploriumLocation',
  label: 'Location',
  description: 'Where the person is based, according to Explorium.',
  icon: 'IconMapPin',
  isNullable: true,
});
