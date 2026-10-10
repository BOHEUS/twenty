import { type SelectOption } from 'src/types/select-option';

export const EMAIL_STATUS_OPTIONS: readonly SelectOption[] = [
  { value: 'VALID', label: 'Valid', color: 'green' },
  { value: 'CATCH_ALL', label: 'Catch-all', color: 'yellow' },
  { value: 'INVALID', label: 'Invalid', color: 'red' },
  { value: 'UNKNOWN', label: 'Unknown', color: 'gray' },
];
