import { type SelectOptionMeta } from 'src/logic-functions/types/select-option-meta';

export const EMAIL_QUALITY_OPTIONS: readonly SelectOptionMeta[] = [
  {
    key: 'verified',
    value: 'VERIFIED',
    label: 'Verified',
    color: 'green',
    position: 0,
  },
  { key: 'valid', value: 'VALID', label: 'Valid', color: 'lime', position: 1 },
  {
    key: 'catchAll',
    value: 'CATCH_ALL',
    label: 'Catch-all',
    color: 'amber',
    position: 2,
  },
  {
    key: 'unverified',
    value: 'UNVERIFIED',
    label: 'Unverified',
    color: 'gray',
    position: 3,
  },
  {
    key: 'invalid',
    value: 'INVALID',
    label: 'Invalid',
    color: 'red',
    position: 4,
  },
];
