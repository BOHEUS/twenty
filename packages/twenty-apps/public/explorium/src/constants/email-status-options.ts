import { type SelectOptionMeta } from 'src/types/select-option-meta';

export const EMAIL_STATUS_OPTIONS: readonly SelectOptionMeta[] = [
  { key: 'valid', value: 'VALID', label: 'Valid', color: 'green', position: 0 },
  {
    key: 'catchAll',
    value: 'CATCH_ALL',
    label: 'Catch-all',
    color: 'yellow',
    position: 1,
  },
  {
    key: 'invalid',
    value: 'INVALID',
    label: 'Invalid',
    color: 'red',
    position: 2,
  },
];
