export const pruneUndefined = <TValue>(
  record: Record<string, TValue | undefined>,
): Record<string, TValue> =>
  Object.fromEntries(
    Object.entries(record).filter(
      (entry): entry is [string, TValue] => entry[1] !== undefined,
    ),
  );
