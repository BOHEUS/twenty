import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { APOLLO_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    APOLLO_FIELD_UNIVERSAL_IDENTIFIERS.person.apolloPersonalEmails,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.ARRAY,
  name: 'apolloPersonalEmails',
  label: 'Apollo Personal Emails',
  description:
    'Personal emails returned when enrichment runs with reveal_personal_emails. The standard emails field holds a single address.',
  icon: 'IconMail',
  isNullable: true,
});
