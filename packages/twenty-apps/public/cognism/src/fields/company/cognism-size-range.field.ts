import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SIZE_RANGE_OPTIONS } from 'src/constants/size-range-options';
import {
  COGNISM_FIELD_UNIVERSAL_IDENTIFIERS,
  COGNISM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/logic-functions/data/build-select-options';

export default defineField({
  universalIdentifier:
    COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismSizeRange,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'cognismSizeRange',
  label: 'Size Range',
  description: 'Employee count bucket derived from the Cognism size range.',
  icon: 'IconUsersGroup',
  isNullable: true,
  options: buildSelectOptions({
    meta: SIZE_RANGE_OPTIONS,
    ids: COGNISM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.sizeRange,
  }),
});
