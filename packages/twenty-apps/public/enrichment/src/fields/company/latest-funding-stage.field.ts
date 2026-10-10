import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { FUNDING_STAGE_OPTIONS } from 'src/constants/funding-stage-options';
import {
  ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS,
  ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS.company.latestFundingStage,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'latestFundingStage',
  label: 'Latest Funding Stage',
  description: "Stage of the company's latest funding round.",
  icon: 'IconTrendingUp',
  isNullable: true,
  options: buildSelectOptions({
    options: FUNDING_STAGE_OPTIONS,
    ids: ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.fundingStage,
  }),
});
