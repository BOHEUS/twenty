import { type SelectOption } from 'src/types/select-option';

export const OPERATING_STATUS_OPTIONS: readonly SelectOption[] = [
  { value: 'OPERATING', label: 'Operating', color: 'green' },
  { value: 'ACQUIRED', label: 'Acquired', color: 'blue' },
  { value: 'CLOSED', label: 'Closed', color: 'gray' },
];
