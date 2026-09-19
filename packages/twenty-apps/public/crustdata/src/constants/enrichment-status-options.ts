import { type SelectOptionMeta } from 'src/types/select-option-meta';

// Crustdata answers a person lookup with `redacted` when the person asked to be removed from the
// dataset: retrying never changes it, so it is worth telling apart from an ordinary no-match.
export const PERSON_ENRICHMENT_STATUS_OPTIONS: readonly SelectOptionMeta[] = [
  { key: 'matched', value: 'MATCHED', label: 'Matched', color: 'green', position: 0 },
  { key: 'notFound', value: 'NOT_FOUND', label: 'No Match', color: 'gray', position: 1 },
  { key: 'redacted', value: 'REDACTED', label: 'Redacted', color: 'orange', position: 2 },
  { key: 'error', value: 'ERROR', label: 'Error', color: 'red', position: 3 },
];

// `redacted` is documented for people, but the response parser reads it for either object, so the
// option exists here too: writing a value the SELECT does not define would fail the whole update.
export const COMPANY_ENRICHMENT_STATUS_OPTIONS: readonly SelectOptionMeta[] = [
  { key: 'matched', value: 'MATCHED', label: 'Matched', color: 'green', position: 0 },
  { key: 'notFound', value: 'NOT_FOUND', label: 'No Match', color: 'gray', position: 1 },
  { key: 'redacted', value: 'REDACTED', label: 'Redacted', color: 'orange', position: 2 },
  { key: 'error', value: 'ERROR', label: 'Error', color: 'red', position: 3 },
];
