import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SNOV_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovSize,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'snovSize',
  label: 'Size',
  description: 'Company size returned by Snov.io.',
  icon: 'IconUsers',
  isNullable: true,
});
