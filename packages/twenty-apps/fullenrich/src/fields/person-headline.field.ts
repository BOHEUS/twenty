import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_HEADLINE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_HEADLINE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'headline',
  type: FieldType.TEXT,
  label: 'Headline',
  description:
    'Self-written professional tagline from the profile. Distinct from job title.',
  icon: 'IconQuote',
  isNullable: true,
  isUIEditable: false,
});
