// FullEnrich returns select values as display strings ("Privately Held", "C-level")
// while Twenty stores option values in screaming snake case. Unrecognised values
// are dropped rather than written, so a taxonomy change cannot corrupt the field.
export const matchSelectValue = <TValue extends string>(
  value: string | undefined,
  allowedValues: readonly TValue[],
): TValue | undefined => {
  if (!value) {
    return undefined;
  }
  const exactMatch = allowedValues.find((allowed) => allowed === value);
  if (exactMatch) {
    return exactMatch;
  }
  const normalizedValue = value.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  return allowedValues.find((allowed) => allowed === normalizedValue);
};
