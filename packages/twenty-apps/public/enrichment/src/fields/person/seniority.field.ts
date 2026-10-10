import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SENIORITY_OPTIONS } from 'src/constants/seniority-options';
import {
  ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS,
  ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier: ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS.person.seniority,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'seniority',
  label: 'Seniority',
  description: "Seniority of the person's current role.",
  icon: 'IconStairsUp',
  isNullable: true,
  options: buildSelectOptions({
    options: SENIORITY_OPTIONS,
    ids: ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.seniority,
  }),
});
