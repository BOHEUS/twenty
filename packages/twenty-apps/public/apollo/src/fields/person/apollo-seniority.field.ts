import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { APOLLO_SENIORITY_OPTIONS } from 'src/constants/seniority-options.constant';
import { APOLLO_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    APOLLO_FIELD_UNIVERSAL_IDENTIFIERS.person.apolloSeniority,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'apolloSeniority',
  label: 'Apollo Seniority',
  description: 'Seniority level returned by Apollo.',
  icon: 'IconStairsUp',
  isNullable: true,
  options: [...APOLLO_SENIORITY_OPTIONS],
});
