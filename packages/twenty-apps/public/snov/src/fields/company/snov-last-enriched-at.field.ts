import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SNOV_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovLastEnrichedAt,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'snovLastEnrichedAt',
  label: 'Last Enriched At',
  description: 'When Snov.io last enriched this record.',
  icon: 'IconClock',
  isNullable: true,
});
