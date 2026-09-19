import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_ENRICHMENT_STATUS_OPTIONS } from 'src/constants/enrichment-status-options';
import {
  CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS,
  CRUSTDATA_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataEnrichmentStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'crustdataEnrichmentStatus',
  label: 'Enrichment Status',
  description: 'Outcome of the latest Crustdata enrichment attempt.',
  icon: 'IconProgressCheck',
  isNullable: true,
  options: buildSelectOptions({
    meta: PERSON_ENRICHMENT_STATUS_OPTIONS,
    ids: CRUSTDATA_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.personEnrichmentStatus,
  }),
});
