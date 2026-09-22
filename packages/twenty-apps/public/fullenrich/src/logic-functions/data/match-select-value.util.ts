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
