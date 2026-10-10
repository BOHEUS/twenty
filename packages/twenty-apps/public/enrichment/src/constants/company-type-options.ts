import { type SelectOption } from 'src/types/select-option';

export const COMPANY_TYPE_OPTIONS: readonly SelectOption[] = [
  { value: 'PUBLIC', label: 'Public', color: 'blue' },
  { value: 'PRIVATE', label: 'Private', color: 'green' },
  { value: 'SUBSIDIARY', label: 'Subsidiary', color: 'purple' },
  { value: 'NONPROFIT', label: 'Nonprofit', color: 'orange' },
  { value: 'EDUCATIONAL', label: 'Educational', color: 'turquoise' },
  { value: 'GOVERNMENT', label: 'Government', color: 'pink' },
  { value: 'PARTNERSHIP', label: 'Partnership', color: 'yellow' },
  { value: 'SELF_EMPLOYED', label: 'Self-employed', color: 'sky' },
  { value: 'OTHER', label: 'Other', color: 'red' },
];
