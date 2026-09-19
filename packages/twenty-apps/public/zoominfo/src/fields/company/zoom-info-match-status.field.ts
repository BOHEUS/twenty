import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_MATCH_STATUS_OPTIONS } from 'src/constants/company-match-status-options';
import {
  ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS,
  ZOOMINFO_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoMatchStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'zoomInfoMatchStatus',
  label: 'Match Status',
  description: 'Match status returned by ZoomInfo for the latest enrichment attempt.',
  icon: 'IconTargetArrow',
  isNullable: true,
  options: buildSelectOptions({
    meta: COMPANY_MATCH_STATUS_OPTIONS,
    ids: ZOOMINFO_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.companyMatchStatus,
  }),
});
