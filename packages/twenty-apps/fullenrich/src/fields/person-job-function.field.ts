import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_JOB_FUNCTION_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_JOB_FUNCTION_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'jobFunction',
  type: FieldType.TEXT,
  label: 'Job function',
  description:
    'Function of the current role. FullEnrich taxonomy is large and unstable, so this is stored as text rather than a select.',
  icon: 'IconBriefcase',
  isNullable: true,
  isUIEditable: false,
});
