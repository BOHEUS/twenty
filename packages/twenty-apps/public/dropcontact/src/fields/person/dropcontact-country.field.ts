import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS.person.dropcontactCountry,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'dropcontactCountry',
  label: 'Country',
  description: 'Country code returned by Dropcontact.',
  icon: 'IconWorld',
  isNullable: true,
});
