import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { APOLLO_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    APOLLO_FIELD_UNIVERSAL_IDENTIFIERS.company
      .apolloHeadcountGrowthTwentyFourMonths,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'apolloHeadcountGrowthTwentyFourMonths',
  label: 'Headcount Growth (24m)',
  description:
    'Percentage change in total headcount over the previous 24 months.',
  icon: 'IconTrendingUp',
  isNullable: true,
});
