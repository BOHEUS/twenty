import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { HUNTER_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterCrunchbaseLink,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.LINKS,
  name: 'hunterCrunchbaseLink',
  label: 'Crunchbase Profile',
  description: 'Crunchbase profile built from the handle Hunter returned.',
  icon: 'IconWorld',
  isNullable: true,
});
