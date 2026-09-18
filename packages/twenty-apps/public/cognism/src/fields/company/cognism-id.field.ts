import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COGNISM_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismId,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'cognismId',
  label: 'Cognism ID',
  description: 'Cognism account identifier.',
  icon: 'IconId',
  isNullable: true,
});
