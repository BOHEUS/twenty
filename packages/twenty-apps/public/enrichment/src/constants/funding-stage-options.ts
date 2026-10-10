import { type SelectOption } from 'src/types/select-option';

export const FUNDING_STAGE_OPTIONS: readonly SelectOption[] = [
  { value: 'PRE_SEED', label: 'Pre-seed', color: 'blue' },
  { value: 'SEED', label: 'Seed', color: 'green' },
  { value: 'ANGEL', label: 'Angel', color: 'purple' },
  { value: 'SERIES_A', label: 'Series A', color: 'orange' },
  { value: 'SERIES_B', label: 'Series B', color: 'turquoise' },
  { value: 'SERIES_C', label: 'Series C', color: 'pink' },
  { value: 'SERIES_D', label: 'Series D', color: 'yellow' },
  { value: 'SERIES_E', label: 'Series E', color: 'sky' },
  { value: 'SERIES_F_PLUS', label: 'Series F+', color: 'red' },
  { value: 'PRIVATE_EQUITY', label: 'Private Equity', color: 'gray' },
  { value: 'DEBT_FINANCING', label: 'Debt Financing', color: 'blue' },
  { value: 'GRANT', label: 'Grant', color: 'green' },
  { value: 'CONVERTIBLE_NOTE', label: 'Convertible Note', color: 'purple' },
  { value: 'CORPORATE_ROUND', label: 'Corporate Round', color: 'orange' },
  { value: 'CROWDFUNDING', label: 'Crowdfunding', color: 'turquoise' },
  { value: 'POST_IPO', label: 'Post-IPO', color: 'pink' },
  { value: 'UNDISCLOSED', label: 'Undisclosed', color: 'yellow' },
];
