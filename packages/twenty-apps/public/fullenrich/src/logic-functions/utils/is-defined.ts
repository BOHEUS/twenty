import { isNull, isUndefined } from '@sniptt/guards';

export const isDefined = <TValue>(
  value: TValue | null | undefined,
): value is NonNullable<TValue> => !isUndefined(value) && !isNull(value);
