import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ENRICHMENT_STATUS_OPTIONS } from 'src/constants/enrichment-status-options';
import {
  HUNTER_FIELD_UNIVERSAL_IDENTIFIERS,
  HUNTER_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterEnrichmentStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'hunterEnrichmentStatus',
  label: 'Enrichment Status',
  description: 'Outcome of the latest Hunter enrichment attempt.',
  icon: 'IconProgressCheck',
  isNullable: true,
  options: buildSelectOptions({
    meta: ENRICHMENT_STATUS_OPTIONS,
    ids: HUNTER_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.personEnrichmentStatus,
  }),
});
