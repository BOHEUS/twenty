import { type SelectOptionMeta } from 'src/logic-functions/types/select-option-meta';

export const MANAGEMENT_LEVEL_OPTIONS: readonly SelectOptionMeta[] = [
  {
    key: 'boardMember',
    value: 'BOARD_MEMBER',
    label: 'Board Member',
    color: 'purple',
    position: 0,
  },
  {
    key: 'cLevel',
    value: 'C_LEVEL',
    label: 'C-Level',
    color: 'violet',
    position: 1,
  },
  {
    key: 'vpLevel',
    value: 'VP_LEVEL',
    label: 'VP-Level',
    color: 'blue',
    position: 2,
  },
  {
    key: 'directorLevel',
    value: 'DIRECTOR_LEVEL',
    label: 'Director-Level',
    color: 'sky',
    position: 3,
  },
  {
    key: 'managerLevel',
    value: 'MANAGER_LEVEL',
    label: 'Manager-Level',
    color: 'turquoise',
    position: 4,
  },
  {
    key: 'senior',
    value: 'SENIOR',
    label: 'Senior',
    color: 'green',
    position: 5,
  },
  { key: 'entry', value: 'ENTRY', label: 'Entry', color: 'lime', position: 6 },
  {
    key: 'owner',
    value: 'OWNER',
    label: 'Owner',
    color: 'orange',
    position: 7,
  },
  {
    key: 'partner',
    value: 'PARTNER',
    label: 'Partner',
    color: 'amber',
    position: 8,
  },
  {
    key: 'intern',
    value: 'INTERN',
    label: 'Intern',
    color: 'gray',
    position: 9,
  },
];
