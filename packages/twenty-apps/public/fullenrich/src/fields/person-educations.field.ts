import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_EDUCATIONS_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_EDUCATIONS_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'educations',
  type: FieldType.RAW_JSON,
  label: 'Education',
  description:
    'Education history: [{ school_name, degree, start_at, end_at }].',
  icon: 'IconSchool',
  isNullable: true,
  isUIEditable: false,
});
