import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { HUNTER_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterTags,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.ARRAY,
  name: 'hunterTags',
  label: 'Tags',
  description: 'Tags returned by Hunter.',
  icon: 'IconTag',
  isNullable: true,
});
