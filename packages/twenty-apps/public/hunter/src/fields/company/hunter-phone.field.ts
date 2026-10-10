import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { HUNTER_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterPhone,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.PHONES,
  name: 'hunterPhone',
  label: 'Phone',
  description: 'Company phone returned by Hunter.',
  icon: 'IconPhone',
  isNullable: true,
});
