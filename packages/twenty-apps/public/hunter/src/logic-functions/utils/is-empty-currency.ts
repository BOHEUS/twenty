import { isNumber } from '@sniptt/guards';

import { isRecord } from 'src/utils/is-record';

export const isEmptyCurrency = (value: unknown): boolean =>
  !isRecord(value) || !isNumber(value.amountMicros);
