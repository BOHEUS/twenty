import { isObject } from '@sniptt/guards';

import { toNumber } from 'src/logic-functions/utils/to-number';
import { isDefined } from 'src/logic-functions/utils/is-defined';

export const isEmptyCurrency = (value: unknown): boolean => {
  if (!isObject(value)) {
    return true;
  }

  const amountMicros = toNumber(
    (value as Record<string, unknown>).amountMicros,
  );

  return !isDefined(amountMicros) || amountMicros === 0;
};
