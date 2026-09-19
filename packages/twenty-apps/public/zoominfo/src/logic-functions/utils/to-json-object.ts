import { isRecord } from 'src/utils/is-record';

export const toJsonObject = (
  value: unknown,
): Record<string, unknown> | undefined =>
  isRecord(value) && Object.keys(value).length > 0 ? value : undefined;
