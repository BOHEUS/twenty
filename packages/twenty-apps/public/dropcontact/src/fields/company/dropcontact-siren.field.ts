import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS.company.dropcontactSiren,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'dropcontactSiren',
  label: 'SIREN',
  description: 'French company registry SIREN number.',
  icon: 'IconId',
  isNullable: true,
});
