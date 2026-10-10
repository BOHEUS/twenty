import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company.amplemarketSize,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'amplemarketSize',
  label: 'Size',
  description: 'Self-reported size range, such as 51-200 employees.',
  icon: 'IconUsers',
  isNullable: true,
});
