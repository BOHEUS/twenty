import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LUSHA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaId,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'lushaId',
  label: 'Lusha ID',
  description:
    'Lusha contact id. Re-enrichment looks the person up by this id.',
  icon: 'IconId',
  isNullable: true,
});
