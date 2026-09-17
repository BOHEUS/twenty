import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LUSHA_ENRICHMENT_STATUS_OPTIONS } from 'src/constants/enrichment-status-options.constant';
import { LUSHA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaEnrichmentStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'lushaEnrichmentStatus',
  label: 'Lusha Status',
  description: 'Outcome of the latest Lusha enrichment.',
  icon: 'IconProgressCheck',
  isNullable: true,
  options: [...LUSHA_ENRICHMENT_STATUS_OPTIONS],
});
