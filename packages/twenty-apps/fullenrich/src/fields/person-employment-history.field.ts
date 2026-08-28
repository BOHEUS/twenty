import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_EMPLOYMENT_HISTORY_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_EMPLOYMENT_HISTORY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'employmentHistory',
  type: FieldType.RAW_JSON,
  label: 'Employment history',
  description:
    'Full employment.all[] payload, including past companies, titles and tenure dates.',
  icon: 'IconHistory',
  isNullable: true,
  isUIEditable: false,
});
