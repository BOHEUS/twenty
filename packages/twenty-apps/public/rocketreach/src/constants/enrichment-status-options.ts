import { type SelectOptionMeta } from 'src/types/select-option-meta';

export const ENRICHMENT_STATUS_OPTIONS: readonly SelectOptionMeta[] = [
  {
    key: 'matched',
    value: 'MATCHED',
    label: 'Matched',
    color: 'green',
    position: 0,
  },
  {
    key: 'pending',
    value: 'PENDING',
    label: 'Pending',
    color: 'yellow',
    position: 1,
  },
  {
    key: 'notFound',
    value: 'NOT_FOUND',
    label: 'No Match',
    color: 'gray',
    position: 2,
  },
  { key: 'error', value: 'ERROR', label: 'Error', color: 'red', position: 3 },
];
