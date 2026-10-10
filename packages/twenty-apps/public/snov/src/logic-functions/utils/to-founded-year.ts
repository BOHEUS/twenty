import { isNumber, isString } from '@sniptt/guards';

const YEAR_REGEX = /^\d{4}$/;

export const toFoundedYear = (founded: unknown): number | undefined => {
  if (isNumber(founded)) {
    return Number.isInteger(founded) ? founded : undefined;
  }

  return isString(founded) && YEAR_REGEX.test(founded.trim())
    ? Number(founded.trim())
    : undefined;
};
