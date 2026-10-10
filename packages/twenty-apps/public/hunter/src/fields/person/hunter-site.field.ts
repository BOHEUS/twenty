import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { HUNTER_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterSite,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.LINKS,
  name: 'hunterSite',
  label: 'Website',
  description: 'Personal website returned by Hunter.',
  icon: 'IconWorld',
  isNullable: true,
});
