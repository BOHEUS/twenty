import { type SelectOptionMeta } from 'src/logic-functions/types/select-option-meta';

export const COMPANY_TYPE_OPTIONS: readonly SelectOptionMeta[] = [
  {
    key: 'publicCompany',
    value: 'PUBLIC',
    label: 'Public',
    color: 'blue',
    position: 0,
  },
  {
    key: 'privateCompany',
    value: 'PRIVATE',
    label: 'Private',
    color: 'green',
    position: 1,
  },
  {
    key: 'nonProfit',
    value: 'NON_PROFIT',
    label: 'Non-Profit',
    color: 'purple',
    position: 2,
  },
  {
    key: 'government',
    value: 'GOVERNMENT',
    label: 'Government',
    color: 'gray',
    position: 3,
  },
  {
    key: 'educational',
    value: 'EDUCATIONAL',
    label: 'Educational',
    color: 'sky',
    position: 4,
  },
  {
    key: 'subsidiary',
    value: 'SUBSIDIARY',
    label: 'Subsidiary',
    color: 'turquoise',
    position: 5,
  },
  {
    key: 'partnership',
    value: 'PARTNERSHIP',
    label: 'Partnership',
    color: 'amber',
    position: 6,
  },
  {
    key: 'selfEmployed',
    value: 'SELF_EMPLOYED',
    label: 'Self-Employed',
    color: 'orange',
    position: 7,
  },
];
