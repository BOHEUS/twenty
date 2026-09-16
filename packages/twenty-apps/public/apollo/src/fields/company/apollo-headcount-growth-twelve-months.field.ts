import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { APOLLO_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    APOLLO_FIELD_UNIVERSAL_IDENTIFIERS.company
      .apolloHeadcountGrowthTwelveMonths,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'apolloHeadcountGrowthTwelveMonths',
  label: 'Headcount Growth (12m)',
  description:
    'Percentage change in total headcount over the previous 12 months.',
  icon: 'IconTrendingUp',
  isNullable: true,
});
