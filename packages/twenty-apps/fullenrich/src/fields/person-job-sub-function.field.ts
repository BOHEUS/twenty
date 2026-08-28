import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_JOB_SUB_FUNCTION_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_JOB_SUB_FUNCTION_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'jobSubFunction',
  type: FieldType.TEXT,
  label: 'Job sub-function',
  description:
    'Sub-function of the current role.',
  icon: 'IconSubtask',
  isNullable: true,
  isUIEditable: false,
});
