import { isBoolean } from '@sniptt/guards';

export const toBoolean = (value: unknown): boolean | undefined =>
  isBoolean(value) ? value : undefined;
