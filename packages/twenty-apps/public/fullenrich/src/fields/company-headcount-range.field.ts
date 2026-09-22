import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_HEADCOUNT_RANGE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_HEADCOUNT_RANGE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  name: 'headcountRange',
  type: FieldType.SELECT,
  label: 'Headcount range',
  description:
    'Employee count bracket. Often present when the exact headcount is not.',
  icon: 'IconChartBar',
  isNullable: true,
  isUIEditable: false,
  options: [
    {
      id: '9ee90a45-bd8c-4717-b09e-cca39fda191d',
      value: '1-10',
      label: '1-10',
      position: 0,
      color: 'gray',
    },
    {
      id: '0bb2bd34-493c-4da0-a8c3-6becad34b462',
      value: '11-50',
      label: '11-50',
      position: 1,
      color: 'blue',
    },
    {
      id: 'edcd1b48-2aa4-4ea8-8bdc-c7eea33d2d6c',
      value: '51-200',
      label: '51-200',
      position: 2,
      color: 'turquoise',
    },
    {
      id: '63840cc8-ec3c-4fd9-a661-b4a673498e53',
      value: '201-500',
      label: '201-500',
      position: 3,
      color: 'green',
    },
    {
      id: '76ed11bf-f78b-4825-8d60-653759e9c942',
      value: '501-1000',
      label: '501-1000',
      position: 4,
      color: 'yellow',
    },
    {
      id: 'f13e432a-b222-47c0-83c3-82cf4610cc73',
      value: '1001-5000',
      label: '1001-5000',
      position: 5,
      color: 'orange',
    },
    {
      id: '53fa8a77-6847-41cb-8bf9-23e5112cb773',
      value: '5001-10000',
      label: '5001-10000',
      position: 6,
      color: 'red',
    },
    {
      id: '6b8b0a14-9b2c-41bd-b830-f86206a17b01',
      value: '10001+',
      label: '10001+',
      position: 7,
      color: 'purple',
    },
  ],
});
