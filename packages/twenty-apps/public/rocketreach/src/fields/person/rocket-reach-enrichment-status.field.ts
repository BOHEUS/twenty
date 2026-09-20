import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ENRICHMENT_STATUS_OPTIONS } from 'src/constants/enrichment-status-options';
import {
  ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS,
  ROCKETREACH_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/logic-functions/utils/build-select-options';

export default defineField({
  universalIdentifier:
    ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachEnrichmentStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'rocketReachEnrichmentStatus',
  label: 'Enrichment Status',
  description: 'Outcome of the latest RocketReach enrichment attempt.',
  icon: 'IconProgressCheck',
  isNullable: true,
  options: buildSelectOptions({
    meta: ENRICHMENT_STATUS_OPTIONS,
    ids: ROCKETREACH_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.personEnrichmentStatus,
  }),
});
