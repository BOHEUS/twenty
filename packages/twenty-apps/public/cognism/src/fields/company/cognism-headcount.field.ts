import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COGNISM_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismHeadcount,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'cognismHeadcount',
  label: 'Employees',
  description: 'Exact employee count returned by Cognism.',
  icon: 'IconUsers',
  isNullable: true,
});
