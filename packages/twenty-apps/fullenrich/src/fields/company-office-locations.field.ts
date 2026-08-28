import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_OFFICE_LOCATIONS_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_OFFICE_LOCATIONS_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  name: 'officeLocations',
  type: FieldType.RAW_JSON,
  label: 'Office locations',
  description:
    'Non-headquarters offices: [{ line1, line2 }]. The standard address field holds only the headquarters.',
  icon: 'IconBuildingSkyscraper',
  isNullable: true,
  isUIEditable: false,
});
