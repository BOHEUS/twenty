import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { EMAIL_STATUS_OPTIONS } from 'src/constants/email-status-options';
import {
  CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS,
  CRUSTDATA_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataEmailStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'crustdataEmailStatus',
  label: 'Email Status',
  description: 'Deliverability of the primary business email returned by contact enrichment.',
  icon: 'IconMailCheck',
  isNullable: true,
  options: buildSelectOptions({
    meta: EMAIL_STATUS_OPTIONS,
    ids: CRUSTDATA_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.emailStatus,
  }),
});
