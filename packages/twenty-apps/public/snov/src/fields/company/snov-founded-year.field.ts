import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SNOV_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovFoundedYear,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'snovFoundedYear',
  label: 'Founded Year',
  description: 'Year the company was founded.',
  icon: 'IconCalendar',
  isNullable: true,
});
