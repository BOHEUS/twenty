import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.person.amplemarketLocation,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.ADDRESS,
  name: 'amplemarketLocation',
  label: 'Location',
  description: 'Where the person is based, according to Amplemarket.',
  icon: 'IconMapPin',
  isNullable: true,
});
