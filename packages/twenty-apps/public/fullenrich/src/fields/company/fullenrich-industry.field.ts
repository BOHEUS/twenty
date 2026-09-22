import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_INDUSTRY_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_INDUSTRY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  name: 'fullEnrichIndustry',
  type: FieldType.TEXT,
  label: 'Industry',
  description:
    'Primary industry. The FullEnrich industry taxonomy has 800+ values, so this is stored as text rather than a select.',
  icon: 'IconBuildingFactory',
  isNullable: true,
  isUIEditable: false,
});
