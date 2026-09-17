// Lusha documents no seniority enum; these are the levels its own examples
// break a company's headcount into. Values Lusha adds later are left unmapped
// rather than failing the write.
export const LUSHA_SENIORITY_OPTIONS = [
  { value: 'C_SUITE', label: 'C-Suite', color: 'purple', position: 0 },
  { value: 'FOUNDER', label: 'Founder', color: 'violet', position: 1 },
  { value: 'PARTNER', label: 'Partner', color: 'iris', position: 2 },
  {
    value: 'VICE_PRESIDENT',
    label: 'Vice President',
    color: 'blue',
    position: 3,
  },
  { value: 'DIRECTOR', label: 'Director', color: 'turquoise', position: 4 },
  { value: 'MANAGER', label: 'Manager', color: 'green', position: 5 },
  { value: 'SENIOR', label: 'Senior', color: 'lime', position: 6 },
  { value: 'NON_MANAGER', label: 'Non-Manager', color: 'yellow', position: 7 },
  { value: 'INTERN', label: 'Intern', color: 'gray', position: 8 },
] as const;

export const LUSHA_SENIORITY_VALUES = new Set<string>(
  LUSHA_SENIORITY_OPTIONS.map((option) => option.value),
);
