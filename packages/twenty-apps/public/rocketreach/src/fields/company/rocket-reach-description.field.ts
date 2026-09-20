import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachDescription,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'rocketReachDescription',
  label: 'Description',
  description: 'Company description returned by RocketReach.',
  icon: 'IconFileDescription',
  isNullable: true,
});
