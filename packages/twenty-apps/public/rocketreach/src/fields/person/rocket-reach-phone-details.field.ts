import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachPhoneDetails,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.RAW_JSON,
  name: 'rocketReachPhoneDetails',
  label: 'Phone Details',
  description: 'Type, confidence grade and country of each phone returned by RocketReach.',
  icon: 'IconPhoneCheck',
  isNullable: true,
});
