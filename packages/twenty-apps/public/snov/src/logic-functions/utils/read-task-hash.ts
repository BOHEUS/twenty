import { isNonEmptyString } from '@sniptt/guards';

import { isRecord } from 'src/utils/is-record';

export const readTaskHash = (
  json: Record<string, unknown>,
): string | undefined => {
  const taskHash = isRecord(json.data)
    ? json.data.task_hash
    : isRecord(json.meta)
      ? json.meta.task_hash
      : undefined;

  return isNonEmptyString(taskHash) ? taskHash : undefined;
};
