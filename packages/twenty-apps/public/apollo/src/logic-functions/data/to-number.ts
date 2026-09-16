import { isNumber, isString } from '@sniptt/guards';

export const toNumber = (value: unknown): number | undefined => {
  if (isNumber(value)) {
    return Number.isFinite(value) ? value : undefined;
  }

  if (isString(value) && value.trim() !== '') {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};
