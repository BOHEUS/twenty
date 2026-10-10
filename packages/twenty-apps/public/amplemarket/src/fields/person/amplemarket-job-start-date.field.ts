import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.person.amplemarketJobStartDate,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.DATE,
  name: 'amplemarketJobStartDate',
  label: 'Job Start Date',
  description: 'When the person started their current position.',
  icon: 'IconCalendar',
  isNullable: true,
});
