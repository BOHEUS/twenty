import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_TYPE_OPTIONS } from 'src/constants/company-type-options';
import {
  ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS,
  ZOOMINFO_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { buildSelectOptions } from 'src/utils/build-select-options';

export default defineField({
  universalIdentifier:
    ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoCompanyType,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'zoomInfoCompanyType',
  label: 'Company Type',
  description: 'Company type returned by ZoomInfo.',
  icon: 'IconBuilding',
  isNullable: true,
  options: buildSelectOptions({
    meta: COMPANY_TYPE_OPTIONS,
    ids: ZOOMINFO_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.companyType,
  }),
});
