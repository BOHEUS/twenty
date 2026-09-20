import { isObject } from '@sniptt/guards';

import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';

export const isEmptyFullName = (value: unknown): boolean => {
  if (!isObject(value)) {
    return true;
  }

  const fullName = value as Record<string, unknown>;

  return isEmptyText(fullName.firstName) && isEmptyText(fullName.lastName);
};
