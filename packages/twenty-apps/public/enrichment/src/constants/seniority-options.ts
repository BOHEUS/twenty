import { type SelectOption } from 'src/types/select-option';

export const SENIORITY_OPTIONS: readonly SelectOption[] = [
  { value: 'OWNER', label: 'Owner', color: 'blue' },
  { value: 'FOUNDER', label: 'Founder', color: 'green' },
  { value: 'BOARD_MEMBER', label: 'Board Member', color: 'purple' },
  { value: 'C_SUITE', label: 'C-Suite', color: 'orange' },
  { value: 'PARTNER', label: 'Partner', color: 'turquoise' },
  { value: 'VP', label: 'VP', color: 'pink' },
  { value: 'HEAD', label: 'Head', color: 'yellow' },
  { value: 'DIRECTOR', label: 'Director', color: 'sky' },
  { value: 'MANAGER', label: 'Manager', color: 'red' },
  { value: 'SENIOR', label: 'Senior', color: 'gray' },
  { value: 'ENTRY', label: 'Entry', color: 'blue' },
  { value: 'INTERN', label: 'Intern', color: 'green' },
];
