import { isNonEmptyString, isString } from '@sniptt/guards';

export const toText = (value: unknown): string | undefined => {
  if (!isString(value)) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return isNonEmptyString(trimmedValue) ? trimmedValue : undefined;
};
