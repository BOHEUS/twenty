import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachCompanyGrowth,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RAW_JSON,
  name: 'rocketReachCompanyGrowth',
  label: 'Headcount Growth',
  description: 'Quarterly headcount growth returned by RocketReach.',
  icon: 'IconTrendingUp',
  isNullable: true,
});
