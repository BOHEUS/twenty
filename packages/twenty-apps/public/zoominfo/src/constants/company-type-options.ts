import { type SelectOptionMeta } from 'src/types/select-option-meta';

export const COMPANY_TYPE_OPTIONS: readonly SelectOptionMeta[] = [
  {
    key: 'private',
    value: 'PRIVATE',
    label: 'Private',
    color: 'blue',
    position: 0,
  },
  {
    key: 'public',
    value: 'PUBLIC',
    label: 'Public',
    color: 'green',
    position: 1,
  },
  {
    key: 'npo',
    value: 'NPO',
    label: 'Non-Profit',
    color: 'purple',
    position: 2,
  },
  {
    key: 'education',
    value: 'EDUCATION',
    label: 'Education',
    color: 'turquoise',
    position: 3,
  },
  {
    key: 'government',
    value: 'GOVERNMENT',
    label: 'Government',
    color: 'orange',
    position: 4,
  },
  { key: 'other', value: 'OTHER', label: 'Other', color: 'gray', position: 5 },
];
