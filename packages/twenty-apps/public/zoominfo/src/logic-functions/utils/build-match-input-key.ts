import { isDefined } from 'twenty-sdk/utils';

import { isRecord } from 'src/utils/is-record';

export const buildMatchInputKey = (matchInput: unknown): string => {
  if (!isRecord(matchInput)) {
    return '';
  }

  const sortedDefinedEntries = Object.entries(matchInput)
    .filter(([, value]) => isDefined(value))
    .map(([key, value]) => [key, String(value)])
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));

  return JSON.stringify(sortedDefinedEntries);
};
