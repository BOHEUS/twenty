import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LUSHA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaPhones,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.PHONES,
  name: 'lushaPhones',
  label: 'Lusha Phones',
  description: 'Company phone numbers returned by Lusha.',
  icon: 'IconPhone',
  isNullable: true,
});
