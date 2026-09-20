import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachTwitterLink,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.LINKS,
  name: 'rocketReachTwitterLink',
  label: 'X',
  description: 'X profile returned by RocketReach.',
  icon: 'IconBrandX',
  isNullable: true,
});
