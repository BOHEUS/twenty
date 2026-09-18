import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COGNISM_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismTechnologies,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.ARRAY,
  name: 'cognismTechnologies',
  label: 'Technologies',
  description: 'Technologies Cognism detected in use.',
  icon: 'IconCode',
  isNullable: true,
});
