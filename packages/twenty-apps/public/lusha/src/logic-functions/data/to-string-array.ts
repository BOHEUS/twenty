import { isArray } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/data/to-text';

export const toStringArray = (value: unknown): string[] | undefined => {
  if (!isArray(value)) {
    return undefined;
  }

  const strings: string[] = [];
  const seenLowerCaseStrings = new Set<string>();

  for (const item of value) {
    const text = toText(item);

    if (!isDefined(text) || seenLowerCaseStrings.has(text.toLowerCase())) {
      continue;
    }

    seenLowerCaseStrings.add(text.toLowerCase());
    strings.push(text);
  }

  return strings.length > 0 ? strings : undefined;
};
