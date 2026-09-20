import { isArray, isNonEmptyArray, isNumber } from '@sniptt/guards';

import { toText } from 'src/logic-functions/utils/to-text';
import { isDefined } from 'src/logic-functions/utils/is-defined';

export const toStringArray = (value: unknown): string[] | undefined => {
  if (!isArray(value)) {
    return undefined;
  }

  const uniqueStrings: string[] = [];
  const seenLowercaseValues = new Set<string>();

  for (const entry of value) {
    const stringValue = isNumber(entry) ? String(entry) : toText(entry);
    if (!isDefined(stringValue)) {
      continue;
    }

    const lowercaseValue = stringValue.toLowerCase();
    if (!seenLowercaseValues.has(lowercaseValue)) {
      seenLowercaseValues.add(lowercaseValue);
      uniqueStrings.push(stringValue);
    }
  }

  return isNonEmptyArray(uniqueStrings) ? uniqueStrings : undefined;
};
