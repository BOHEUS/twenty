import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SNOV_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovLastUpdatedAt,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.DATE,
  name: 'snovLastUpdatedAt',
  label: 'Snov.io Updated At',
  description: 'When Snov.io last updated this profile.',
  icon: 'IconClock',
  isNullable: true,
});
