import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_LOCATION_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_LOCATION_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'location',
  type: FieldType.ADDRESS,
  label: 'Location',
  description:
    'City, region and country reported on the profile. Street and postcode are never returned by FullEnrich.',
  icon: 'IconMapPin',
  isNullable: true,
  isUIEditable: false,
});
