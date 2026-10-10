import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { HUNTER_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterEmployeeCount,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'hunterEmployeeCount',
  label: 'Employee Count',
  description: 'Employee count returned by Hunter.',
  icon: 'IconUsers',
  isNullable: true,
});
