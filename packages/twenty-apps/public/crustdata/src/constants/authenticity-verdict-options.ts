import { type SelectOptionMeta } from 'src/types/select-option-meta';

export const AUTHENTICITY_VERDICT_OPTIONS: readonly SelectOptionMeta[] = [
  { key: 'clearlyGenuine', value: 'CLEARLY_GENUINE', label: 'Clearly Genuine', color: 'green', position: 0 },
  { key: 'probablyGenuine', value: 'PROBABLY_GENUINE', label: 'Probably Genuine', color: 'jade', position: 1 },
  { key: 'cannotVerify', value: 'CANNOT_VERIFY', label: 'Cannot Verify', color: 'gray', position: 2 },
  { key: 'probablyFabricated', value: 'PROBABLY_FABRICATED', label: 'Probably Fabricated', color: 'orange', position: 3 },
  { key: 'clearlyFabricated', value: 'CLEARLY_FABRICATED', label: 'Clearly Fabricated', color: 'red', position: 4 },
];
