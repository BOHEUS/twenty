import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { JOB_DEPARTMENT_OPTIONS } from 'src/constants/job-department-options';
import {
  EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS,
  EXPLORIUM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumJobDepartments,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.MULTI_SELECT,
  name: 'exploriumJobDepartments',
  label: 'Job Departments',
  description: 'Explorium job departments, main department first.',
  icon: 'IconBriefcase',
  isNullable: true,
  options: buildSelectOptions({
    meta: JOB_DEPARTMENT_OPTIONS,
    ids: EXPLORIUM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.jobDepartment,
  }),
});
