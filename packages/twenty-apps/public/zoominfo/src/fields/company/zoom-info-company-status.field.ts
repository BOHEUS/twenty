import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_STATUS_OPTIONS } from 'src/constants/company-status-options';
import {
  ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS,
  ZOOMINFO_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoCompanyStatus,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'zoomInfoCompanyStatus',
  label: 'Company Status',
  description: 'Whether ZoomInfo still considers this company active.',
  icon: 'IconHeartbeat',
  isNullable: true,
  options: buildSelectOptions({
    meta: COMPANY_STATUS_OPTIONS,
    ids: ZOOMINFO_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.companyStatus,
  }),
});
