import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { MANAGEMENT_LEVEL_OPTIONS } from 'src/constants/management-level-options';
import {
  COGNISM_FIELD_UNIVERSAL_IDENTIFIERS,
  COGNISM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/logic-functions/data/build-select-options';

export default defineField({
  universalIdentifier:
    COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismManagementLevel,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'cognismManagementLevel',
  label: 'Management Level',
  description: 'Cognism management level for the current role.',
  icon: 'IconStairsUp',
  isNullable: true,
  options: buildSelectOptions({
    meta: MANAGEMENT_LEVEL_OPTIONS,
    ids: COGNISM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.managementLevel,
  }),
});
