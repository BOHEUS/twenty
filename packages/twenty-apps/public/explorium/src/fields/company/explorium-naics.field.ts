import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumNaics,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'exploriumNaics',
  label: 'NAICS Code',
  description: 'NAICS code returned by Explorium.',
  icon: 'IconHash',
  isNullable: true,
});
