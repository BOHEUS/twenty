import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_HEADCOUNT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_HEADCOUNT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  name: 'headcount',
  type: FieldType.NUMBER,
  label: 'Headcount',
  description:
    'Employee count reported by FullEnrich. May be 0 even when a headcount range is available.',
  icon: 'IconUsers',
  isNullable: true,
  isUIEditable: false,
});
