import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { APOLLO_ENRICHMENT_STATUS_OPTIONS } from 'src/constants/enrichment-status-options.constant';
import { APOLLO_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    APOLLO_FIELD_UNIVERSAL_IDENTIFIERS.person.apolloEnrichmentStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'apolloEnrichmentStatus',
  label: 'Apollo Enrichment Status',
  description: 'Outcome of the last Apollo enrichment attempt.',
  icon: 'IconSparkles',
  isNullable: true,
  options: [...APOLLO_ENRICHMENT_STATUS_OPTIONS],
});
