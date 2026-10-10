import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS.person.dropcontactCivility,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'dropcontactCivility',
  label: 'Civility',
  description: 'Civility returned by Dropcontact.',
  icon: 'IconUser',
  isNullable: true,
});
