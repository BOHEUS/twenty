import { type SelectOptionMeta } from 'src/types/select-option-meta';

export const GENDER_OPTIONS: readonly SelectOptionMeta[] = [
  { key: 'male', value: 'MALE', label: 'Male', color: 'blue', position: 0 },
  {
    key: 'female',
    value: 'FEMALE',
    label: 'Female',
    color: 'green',
    position: 1,
  },
];
