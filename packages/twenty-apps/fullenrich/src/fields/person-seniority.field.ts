import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_SENIORITY_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_SENIORITY_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  name: 'seniority',
  type: FieldType.SELECT,
  label: 'Seniority',
  description:
    'Seniority of the current role.',
  icon: 'IconStairsUp',
  isNullable: true,
  isUIEditable: false,
  options: [
    {
      id: 'b5543553-facc-4b6b-b276-ecf581b48a06',
      value: 'OWNER',
      label: 'Owner',
      position: 0,
      color: 'purple',
    },
    {
      id: '3f961be5-164e-4162-bd15-89cddc079b49',
      value: 'FOUNDER',
      label: 'Founder',
      position: 1,
      color: 'purple',
    },
    {
      id: '95b5cb5f-43d0-4aa1-86b4-8a53d0cf25d3',
      value: 'C_LEVEL',
      label: 'C-level',
      position: 2,
      color: 'red',
    },
    {
      id: 'b1a4e9f6-7de5-4a4f-9b9f-f92411934753',
      value: 'PARTNER',
      label: 'Partner',
      position: 3,
      color: 'red',
    },
    {
      id: '72449ab8-3982-49fa-8912-774115f4f56b',
      value: 'VP',
      label: 'VP',
      position: 4,
      color: 'orange',
    },
    {
      id: 'd5b80e12-e690-4f75-b099-a75c703591f2',
      value: 'HEAD',
      label: 'Head',
      position: 5,
      color: 'orange',
    },
    {
      id: 'b35505af-34cb-4ab7-b146-c186669a8cfe',
      value: 'DIRECTOR',
      label: 'Director',
      position: 6,
      color: 'yellow',
    },
    {
      id: 'ffecfb66-7fa3-43ef-9311-217b0a6698e5',
      value: 'MANAGER',
      label: 'Manager',
      position: 7,
      color: 'green',
    },
    {
      id: 'c8204758-20cc-4a9b-be2a-0271b2442966',
      value: 'SENIOR',
      label: 'Senior',
      position: 8,
      color: 'blue',
    },
  ],
});
