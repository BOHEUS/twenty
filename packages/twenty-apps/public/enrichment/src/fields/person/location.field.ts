import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS.person.location,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.ADDRESS,
  name: 'location',
  label: 'Location',
  description:
    'Where the person is based. Some providers only return a country.',
  icon: 'IconMapPin',
  isNullable: true,
});
