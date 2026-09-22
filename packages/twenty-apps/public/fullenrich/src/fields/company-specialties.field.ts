import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_SPECIALTIES_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_SPECIALTIES_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  name: 'specialties',
  type: FieldType.ARRAY,
  label: 'Specialties',
  description:
    'Specialties listed on the company profile.',
  icon: 'IconTag',
  isNullable: true,
  isUIEditable: false,
});
