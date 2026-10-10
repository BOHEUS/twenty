import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { HUNTER_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterSubRole,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'hunterSubRole',
  label: 'Sub-role',
  description: 'Job sub-role returned by Hunter.',
  icon: 'IconBriefcase',
  isNullable: true,
});
