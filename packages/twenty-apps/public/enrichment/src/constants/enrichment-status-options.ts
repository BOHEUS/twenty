import { type SelectOption } from 'src/types/select-option';

// Same values the provider apps already write to their own status fields
export const ENRICHMENT_STATUS_OPTIONS: readonly SelectOption[] = [
  { value: 'MATCHED', label: 'Matched', color: 'green' },
  { value: 'NOT_FOUND', label: 'No Match', color: 'gray' },
  { value: 'ERROR', label: 'Error', color: 'red' },
];
