import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { HUNTER_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterGithubFollowers,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'hunterGithubFollowers',
  label: 'GitHub Followers',
  description: 'GitHub follower count returned by Hunter.',
  icon: 'IconUsers',
  isNullable: true,
});
