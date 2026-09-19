import { type SelectOptionMeta } from 'src/types/select-option-meta';

export const EMAIL_STATUS_OPTIONS: readonly SelectOptionMeta[] = [
  { key: 'deliverable', value: 'DELIVERABLE', label: 'Deliverable', color: 'green', position: 0 },
  { key: 'catchAll', value: 'CATCH_ALL', label: 'Catch All', color: 'yellow', position: 1 },
  { key: 'invalid', value: 'INVALID', label: 'Invalid', color: 'red', position: 2 },
  { key: 'unknown', value: 'UNKNOWN', label: 'Unknown', color: 'gray', position: 3 },
];
