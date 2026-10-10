import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SIZE_RANGE_OPTIONS } from 'src/constants/size-range-options';
import {
  ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS,
  ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier: ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS.company.sizeRange,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'sizeRange',
  label: 'Size Range',
  description: 'Range the employee count falls in.',
  icon: 'IconChartBar',
  isNullable: true,
  options: buildSelectOptions({
    options: SIZE_RANGE_OPTIONS,
    ids: ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.sizeRange,
  }),
});
