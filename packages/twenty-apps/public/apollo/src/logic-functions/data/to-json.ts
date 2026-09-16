import { isObject } from '@sniptt/guards';

export const toJsonArray = (value: unknown): unknown[] | undefined =>
  Array.isArray(value) && value.length > 0 ? value : undefined;

export const toJsonObject = (
  value: unknown,
): Record<string, unknown> | undefined =>
  isObject(value) && !Array.isArray(value) && Object.keys(value).length > 0
    ? (value as Record<string, unknown>)
    : undefined;
