import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachLinkedinActive,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.BOOLEAN,
  name: 'rocketReachLinkedinActive',
  label: 'LinkedIn Profile Active',
  description: 'Whether RocketReach still sees the LinkedIn profile as active.',
  icon: 'IconBrandLinkedin',
  isNullable: true,
});
