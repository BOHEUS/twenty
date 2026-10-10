import { isNumber, isString } from '@sniptt/guards';

const NUMERIC_SEPARATORS_REGEX = /[\s ]/g;

export const toNumericValue = (value: unknown): number | undefined => {
  if (isNumber(value)) {
    return Number.isFinite(value) ? value : undefined;
  }

  if (!isString(value)) {
    return undefined;
  }

  const normalizedValue = value
    .replace(NUMERIC_SEPARATORS_REGEX, '')
    .replace(',', '.');

  if (normalizedValue === '') {
    return undefined;
  }

  const numericValue = Number(normalizedValue);

  return Number.isFinite(numericValue) ? numericValue : undefined;
};
