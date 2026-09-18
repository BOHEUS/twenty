import { isArray, isString } from '@sniptt/guards';

// Cognism returns single-valued taxonomies as a bare string and multi-valued
// ones as an array, on the same field.
export const toMultiValue = (value: unknown): unknown[] => {
  if (isArray(value)) {
    return value;
  }

  return isString(value) ? [value] : [];
};
