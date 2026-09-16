import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { APOLLO_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: APOLLO_FIELD_UNIVERSAL_IDENTIFIERS.person.apolloHeadline,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'apolloHeadline',
  label: 'Apollo Headline',
  description: 'Professional headline returned by Apollo.',
  icon: 'IconQuote',
  isNullable: true,
});
