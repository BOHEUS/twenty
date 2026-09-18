import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COGNISM_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismId,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'cognismId',
  label: 'Cognism ID',
  description: 'Cognism contact identifier.',
  icon: 'IconId',
  isNullable: true,
});
