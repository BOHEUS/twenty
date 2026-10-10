import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { REVENUE_RANGE_OPTIONS } from 'src/constants/revenue-range-options';
import {
  EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS,
  EXPLORIUM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumRevenueRange,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'exploriumRevenueRange',
  label: 'Revenue Range',
  description: 'Yearly revenue range in USD returned by Explorium.',
  icon: 'IconCoin',
  isNullable: true,
  options: buildSelectOptions({
    meta: REVENUE_RANGE_OPTIONS,
    ids: EXPLORIUM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.revenueRange,
  }),
});
