import { isObject } from '@sniptt/guards';

import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';

export const isEmptyLinks = (value: unknown): boolean => {
  if (!isObject(value)) {
    return true;
  }

  return isEmptyText((value as Record<string, unknown>).primaryLinkUrl);
};
