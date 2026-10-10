import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ENRICHMENT_STATUS_OPTIONS } from 'src/constants/enrichment-status-options';
import {
  AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS,
  AMPLEMARKET_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company.amplemarketEnrichmentStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'amplemarketEnrichmentStatus',
  label: 'Enrichment Status',
  description: 'Outcome of the latest Amplemarket enrichment attempt.',
  icon: 'IconProgressCheck',
  isNullable: true,
  options: buildSelectOptions({
    meta: ENRICHMENT_STATUS_OPTIONS,
    ids: AMPLEMARKET_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.companyEnrichmentStatus,
  }),
});
