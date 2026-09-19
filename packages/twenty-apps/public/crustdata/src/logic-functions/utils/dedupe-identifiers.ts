// Crustdata matches identifiers case-insensitively and bills per identifier submitted, so two
// records differing only in case must not be sent (and charged) twice.
export const dedupeIdentifiers = (identifiers: string[]): string[] => {
  const identifierByKey = new Map<string, string>();

  for (const identifier of identifiers) {
    const key = identifier.toLowerCase();

    if (!identifierByKey.has(key)) {
      identifierByKey.set(key, identifier);
    }
  }

  return Array.from(identifierByKey.values());
};
