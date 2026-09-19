import { isNumber } from '@sniptt/guards';

import { toText } from 'src/logic-functions/utils/to-text';

// ZoomInfo record ids come back as integers on nested objects and as strings at
// the top level of a response item.
export const toIdentifierText = (value: unknown): string | undefined => {
  if (isNumber(value)) {
    return Number.isFinite(value) ? String(value) : undefined;
  }

  return toText(value);
};
