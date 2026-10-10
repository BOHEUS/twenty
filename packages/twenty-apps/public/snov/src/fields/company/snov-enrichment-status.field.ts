import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ENRICHMENT_STATUS_OPTIONS } from 'src/constants/enrichment-status-options';
import {
  SNOV_FIELD_UNIVERSAL_IDENTIFIERS,
  SNOV_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovEnrichmentStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'snovEnrichmentStatus',
  label: 'Enrichment Status',
  description: 'Outcome of the latest Snov.io enrichment attempt.',
  icon: 'IconProgressCheck',
  isNullable: true,
  options: buildSelectOptions({
    meta: ENRICHMENT_STATUS_OPTIONS,
    ids: SNOV_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.companyEnrichmentStatus,
  }),
});
