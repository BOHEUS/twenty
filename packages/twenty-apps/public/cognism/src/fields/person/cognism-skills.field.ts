import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COGNISM_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismSkills,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.ARRAY,
  name: 'cognismSkills',
  label: 'Skills',
  description: 'Skills returned by Cognism.',
  icon: 'IconBulb',
  isNullable: true,
});
