import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { HUNTER_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterEmployeeRange,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'hunterEmployeeRange',
  label: 'Employee Range',
  description: 'Employee range returned by Hunter.',
  icon: 'IconUsers',
  isNullable: true,
});
