import { isArray, isNonEmptyArray, isObject } from '@sniptt/guards';

export const toJsonObject = (
  value: unknown,
): Record<string, unknown> | undefined =>
  isObject(value) && !isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

export const toJsonArray = (value: unknown): unknown[] | undefined =>
  isNonEmptyArray(value) ? value : undefined;
