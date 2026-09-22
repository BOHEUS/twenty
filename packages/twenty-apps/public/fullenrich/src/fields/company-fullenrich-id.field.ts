import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FULLENRICH_ID_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FULLENRICH_ID_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  name: 'fullEnrichCompanyId',
  type: FieldType.UUID,
  label: 'FullEnrich ID',
  description:
    'FullEnrich company id, used to correlate re-enrichments with an earlier result.',
  icon: 'IconFingerprint',
  isNullable: true,
  isUIEditable: false,
});
