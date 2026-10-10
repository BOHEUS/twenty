import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumLinkedinUrls,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.ARRAY,
  name: 'exploriumLinkedinUrls',
  label: 'LinkedIn URLs',
  description: 'Every LinkedIn URL Explorium has for the person.',
  icon: 'IconBrandLinkedin',
  isNullable: true,
});
