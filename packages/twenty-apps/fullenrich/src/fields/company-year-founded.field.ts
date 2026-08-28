import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_YEAR_FOUNDED_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_YEAR_FOUNDED_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  name: 'yearFounded',
  type: FieldType.NUMBER,
  label: 'Year founded',
  description:
    'Year the company was founded.',
  icon: 'IconCalendar',
  isNullable: true,
  isUIEditable: false,
});
