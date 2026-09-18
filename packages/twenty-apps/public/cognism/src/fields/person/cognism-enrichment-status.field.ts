import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ENRICHMENT_STATUS_OPTIONS } from 'src/constants/enrichment-status-options';
import {
  COGNISM_FIELD_UNIVERSAL_IDENTIFIERS,
  COGNISM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/logic-functions/data/build-select-options';

export default defineField({
  universalIdentifier:
    COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismEnrichmentStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'cognismEnrichmentStatus',
  label: 'Enrichment Status',
  description: 'Outcome of the latest Cognism enrichment attempt.',
  icon: 'IconProgressCheck',
  isNullable: true,
  options: buildSelectOptions({
    meta: ENRICHMENT_STATUS_OPTIONS,
    ids: COGNISM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.personEnrichmentStatus,
  }),
});
