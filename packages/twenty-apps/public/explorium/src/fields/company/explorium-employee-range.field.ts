import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { EMPLOYEE_RANGE_OPTIONS } from 'src/constants/employee-range-options';
import {
  EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS,
  EXPLORIUM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumEmployeeRange,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'exploriumEmployeeRange',
  label: 'Employee Range',
  description: 'Number of employees range returned by Explorium.',
  icon: 'IconUsers',
  isNullable: true,
  options: buildSelectOptions({
    meta: EMPLOYEE_RANGE_OPTIONS,
    ids: EXPLORIUM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.employeeRange,
  }),
});
