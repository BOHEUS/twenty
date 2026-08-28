import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_LANGUAGES_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_LANGUAGES_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'languages',
  type: FieldType.RAW_JSON,
  label: 'Languages',
  description:
    'Languages with proficiency, as returned by FullEnrich: [{ language, proficiency }].',
  icon: 'IconLanguage',
  isNullable: true,
  isUIEditable: false,
});
