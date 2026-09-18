import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { JOB_FUNCTION_OPTIONS } from 'src/constants/job-function-options';
import {
  COGNISM_FIELD_UNIVERSAL_IDENTIFIERS,
  COGNISM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/logic-functions/data/build-select-options';

export default defineField({
  universalIdentifier:
    COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismJobFunction,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.MULTI_SELECT,
  name: 'cognismJobFunction',
  label: 'Job Function',
  description: 'Cognism job functions for the current role.',
  icon: 'IconBriefcase',
  isNullable: true,
  options: buildSelectOptions({
    meta: JOB_FUNCTION_OPTIONS,
    ids: COGNISM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.jobFunction,
  }),
});
