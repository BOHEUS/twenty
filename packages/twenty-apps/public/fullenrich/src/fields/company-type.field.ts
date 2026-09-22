import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_TYPE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  name: 'companyType',
  type: FieldType.SELECT,
  label: 'Company type',
  description:
    'Ownership structure reported by FullEnrich.',
  icon: 'IconBuilding',
  isNullable: true,
  isUIEditable: false,
  options: [
    {
      id: 'a1e34fe2-bfed-441b-9f20-67482c5310f8',
      value: 'PRIVATELY_HELD',
      label: 'Privately held',
      position: 0,
      color: 'blue',
    },
    {
      id: '28eb59d4-8de8-4796-a740-d1ef692c20c7',
      value: 'PUBLIC_COMPANY',
      label: 'Public company',
      position: 1,
      color: 'green',
    },
    {
      id: '9eae3ea5-19da-4f83-bbc2-a0a9dfc6567e',
      value: 'PARTNERSHIP',
      label: 'Partnership',
      position: 2,
      color: 'turquoise',
    },
    {
      id: 'd21b411b-7b6c-4381-b31e-1e6a98a7665a',
      value: 'NONPROFIT',
      label: 'Nonprofit',
      position: 3,
      color: 'purple',
    },
    {
      id: '45e2a2cd-8304-4625-a212-52081524b5a0',
      value: 'EDUCATIONAL',
      label: 'Educational',
      position: 4,
      color: 'yellow',
    },
    {
      id: '3cb919bb-af29-41c5-98dc-d151ae868176',
      value: 'GOVERNMENT_AGENCY',
      label: 'Government agency',
      position: 5,
      color: 'orange',
    },
    {
      id: '80a70f69-75b2-418a-8409-bf0d06f632c1',
      value: 'SELF_OWNED',
      label: 'Self-owned',
      position: 6,
      color: 'gray',
    },
    {
      id: '729d2cd2-e85e-41e2-b5c1-c6503b090665',
      value: 'SELF_EMPLOYED',
      label: 'Self-employed',
      position: 7,
      color: 'gray',
    },
  ],
});
