import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { APOLLO_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: APOLLO_FIELD_UNIVERSAL_IDENTIFIERS.person.apolloLocation,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.ADDRESS,
  name: 'apolloLocation',
  label: 'Apollo Location',
  description:
    'City, state and country returned by Apollo. Person has no standard address field.',
  icon: 'IconMapPin',
  isNullable: true,
});
