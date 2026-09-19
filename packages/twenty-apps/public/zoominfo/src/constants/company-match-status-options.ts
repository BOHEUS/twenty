import { type SelectOptionMeta } from 'src/types/select-option-meta';

export const COMPANY_MATCH_STATUS_OPTIONS: readonly SelectOptionMeta[] = [
  {
    key: 'fullMatch',
    value: 'FULL_MATCH',
    label: 'Full Match',
    color: 'green',
    position: 0,
  },
  {
    key: 'noMatch',
    value: 'NO_MATCH',
    label: 'No Match',
    color: 'gray',
    position: 1,
  },
  {
    key: 'limitExceeded',
    value: 'LIMIT_EXCEEDED',
    label: 'Limit Exceeded',
    color: 'orange',
    position: 2,
  },
  {
    key: 'invalidInput',
    value: 'INVALID_INPUT',
    label: 'Invalid Input',
    color: 'red',
    position: 3,
  },
];
