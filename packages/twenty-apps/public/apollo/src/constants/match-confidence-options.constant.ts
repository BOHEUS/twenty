export const APOLLO_MATCH_CONFIDENCE_OPTIONS = [
  { value: 'HIGH', label: 'High', color: 'green', position: 0 },
  { value: 'MEDIUM', label: 'Medium', color: 'yellow', position: 1 },
  { value: 'LOW', label: 'Low', color: 'orange', position: 2 },
  { value: 'NONE', label: 'None', color: 'gray', position: 3 },
] as const;

export const APOLLO_MATCH_CONFIDENCE_VALUES = new Set<string>(
  APOLLO_MATCH_CONFIDENCE_OPTIONS.map((option) => option.value),
);
