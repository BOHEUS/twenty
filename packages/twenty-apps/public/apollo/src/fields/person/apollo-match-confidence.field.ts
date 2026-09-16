import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { APOLLO_MATCH_CONFIDENCE_OPTIONS } from 'src/constants/match-confidence-options.constant';
import { APOLLO_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    APOLLO_FIELD_UNIVERSAL_IDENTIFIERS.person.apolloMatchConfidence,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'apolloMatchConfidence',
  label: 'Apollo Match Confidence',
  description:
    'How confident Apollo is that this person matches the record it was given.',
  icon: 'IconTargetArrow',
  isNullable: true,
  options: [...APOLLO_MATCH_CONFIDENCE_OPTIONS],
});
