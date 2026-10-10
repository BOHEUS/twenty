import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { HUNTER_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterLegalName,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'hunterLegalName',
  label: 'Legal Name',
  description: 'Legal name returned by Hunter.',
  icon: 'IconLicense',
  isNullable: true,
});
