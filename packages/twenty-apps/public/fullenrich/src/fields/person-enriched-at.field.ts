import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_ENRICHED_AT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_ENRICHED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'enrichedAt',
  type: FieldType.DATE_TIME,
  label: 'Enriched at',
  description:
    'When FullEnrich last returned enrichment data for this person. Set on webhook receipt, since FullEnrich does not timestamp its response.',
  icon: 'IconClockCheck',
  isNullable: true,
  isUIEditable: false,
});
