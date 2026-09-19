import { isNumber } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/utils/to-text';

// ZoomInfo returns some numerics as strings (contactAccuracyScore, foundedYear).
export const toNumberLike = (value: unknown): number | undefined => {
  if (isNumber(value)) {
    return Number.isFinite(value) ? value : undefined;
  }

  const text = toText(value);
  if (!isDefined(text)) {
    return undefined;
  }

  const parsed = Number(text.replace(/,/g, ''));

  return Number.isFinite(parsed) ? parsed : undefined;
};
