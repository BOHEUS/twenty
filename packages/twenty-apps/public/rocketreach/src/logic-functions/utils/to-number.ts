import { isNumber, isString } from '@sniptt/guards';

// RocketReach types birth_year as a string and industry codes as integers, so
// both shapes reach the same numeric fields.
export const toNumber = (value: unknown): number | undefined => {
  if (isNumber(value)) {
    return Number.isFinite(value) ? value : undefined;
  }

  if (!isString(value)) {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed === '') {
    return undefined;
  }

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) ? parsed : undefined;
};
