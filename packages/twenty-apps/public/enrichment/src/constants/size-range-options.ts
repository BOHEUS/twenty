import { type SelectOption } from 'src/types/select-option';

export const SIZE_RANGE_OPTIONS: readonly SelectOption[] = [
  { value: 'ONE_TO_TEN', label: '1-10', color: 'blue' },
  { value: 'ELEVEN_TO_FIFTY', label: '11-50', color: 'red' },
  { value: 'FIFTY_ONE_TO_TWO_HUNDRED', label: '51-200', color: 'green' },
  {
    value: 'TWO_HUNDRED_ONE_TO_FIVE_HUNDRED',
    label: '201-500',
    color: 'orange',
  },
  {
    value: 'FIVE_HUNDRED_ONE_TO_ONE_THOUSAND',
    label: '501-1000',
    color: 'purple',
  },
  {
    value: 'ONE_THOUSAND_ONE_TO_FIVE_THOUSAND',
    label: '1001-5000',
    color: 'yellow',
  },
  {
    value: 'FIVE_THOUSAND_ONE_TO_TEN_THOUSAND',
    label: '5001-10000',
    color: 'pink',
  },
  { value: 'TEN_THOUSAND_ONE_PLUS', label: '10001+', color: 'cyan' },
];
