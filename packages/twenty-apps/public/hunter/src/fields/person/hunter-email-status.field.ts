import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { HUNTER_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterEmailStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'hunterEmailStatus',
  label: 'Email Status',
  description:
    'Verification status of the found email: valid, accept_all or unknown.',
  icon: 'IconMailCheck',
  isNullable: true,
});
