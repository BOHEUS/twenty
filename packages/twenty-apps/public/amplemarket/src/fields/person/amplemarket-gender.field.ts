import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.person.amplemarketGender,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'amplemarketGender',
  label: 'Gender',
  description: 'Gender returned by Amplemarket.',
  icon: 'IconUser',
  isNullable: true,
});
