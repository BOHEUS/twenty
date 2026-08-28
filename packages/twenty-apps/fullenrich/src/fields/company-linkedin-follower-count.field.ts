import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_LINKEDIN_FOLLOWER_COUNT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_LINKEDIN_FOLLOWER_COUNT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  name: 'linkedinFollowerCount',
  type: FieldType.NUMBER,
  label: 'LinkedIn followers',
  description:
    'Follower count on the professional network company page.',
  icon: 'IconUsersGroup',
  isNullable: true,
  isUIEditable: false,
});
