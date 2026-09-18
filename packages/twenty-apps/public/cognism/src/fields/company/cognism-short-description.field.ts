import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COGNISM_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismShortDescription,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'cognismShortDescription',
  label: 'Short Description',
  description: 'Short company description returned by Cognism.',
  icon: 'IconFileText',
  isNullable: true,
});
