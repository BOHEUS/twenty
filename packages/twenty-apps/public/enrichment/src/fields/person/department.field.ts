import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { DEPARTMENT_OPTIONS } from 'src/constants/department-options';
import {
  ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS,
  ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier: ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS.person.department,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.MULTI_SELECT,
  name: 'department',
  label: 'Department',
  description: "Departments or job functions of the person's current role.",
  icon: 'IconCategory',
  isNullable: true,
  options: buildSelectOptions({
    options: DEPARTMENT_OPTIONS,
    ids: ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.department,
  }),
});
