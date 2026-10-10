import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ENRICHMENT_STATUS_OPTIONS } from 'src/constants/enrichment-status-options';
import {
  ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS,
  ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS.company.enrichmentStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'enrichmentStatus',
  label: 'Enrichment Status',
  description: 'Outcome of the latest enrichment attempt.',
  icon: 'IconProgressCheck',
  isNullable: true,
  options: buildSelectOptions({
    options: ENRICHMENT_STATUS_OPTIONS,
    ids: ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.companyEnrichmentStatus,
  }),
});
