import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS.company.dropcontactVat,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'dropcontactVat',
  label: 'VAT Number',
  description: 'VAT number from the French company registry.',
  icon: 'IconReceiptTax',
  isNullable: true,
});
