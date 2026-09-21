export const APOLLO_SENIORITY_OPTIONS = [
  { value: 'OWNER', label: 'Owner', color: 'red', position: 0 },
  { value: 'FOUNDER', label: 'Founder', color: 'purple', position: 1 },
  { value: 'C_SUITE', label: 'C-Suite', color: 'violet', position: 2 },
  { value: 'PARTNER', label: 'Partner', color: 'iris', position: 3 },
  { value: 'VP', label: 'VP', color: 'blue', position: 4 },
  { value: 'HEAD', label: 'Head', color: 'sky', position: 5 },
  { value: 'DIRECTOR', label: 'Director', color: 'turquoise', position: 6 },
  { value: 'MANAGER', label: 'Manager', color: 'green', position: 7 },
  { value: 'SENIOR', label: 'Senior', color: 'lime', position: 8 },
  { value: 'ENTRY', label: 'Entry', color: 'yellow', position: 9 },
  { value: 'INTERN', label: 'Intern', color: 'gray', position: 10 },
] as const;

export const APOLLO_SENIORITY_VALUES = new Set<string>(
  APOLLO_SENIORITY_OPTIONS.map((option) => option.value),
);
