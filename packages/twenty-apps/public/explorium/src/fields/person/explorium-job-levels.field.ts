import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { JOB_LEVEL_OPTIONS } from 'src/constants/job-level-options';
import {
  EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS,
  EXPLORIUM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumJobLevels,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.MULTI_SELECT,
  name: 'exploriumJobLevels',
  label: 'Job Levels',
  description: 'Explorium job levels, main level first.',
  icon: 'IconStairsUp',
  isNullable: true,
  options: buildSelectOptions({
    meta: JOB_LEVEL_OPTIONS,
    ids: EXPLORIUM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.jobLevel,
  }),
});
