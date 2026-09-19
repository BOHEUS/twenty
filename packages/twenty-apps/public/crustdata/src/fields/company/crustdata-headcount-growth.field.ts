import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataHeadcountGrowth,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RAW_JSON,
  name: 'crustdataHeadcountGrowth',
  label: 'Headcount Growth',
  description: 'Headcount growth percentages over trailing windows, keyed mom, qoq, six_months, yoy and two_years.',
  icon: 'IconTrendingUp',
  isNullable: true,
});
