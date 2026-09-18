import { isObject } from '@sniptt/guards';

import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';

export const isEmptyComposite =
  (...subFieldNames: string[]) =>
  (value: unknown): boolean => {
    if (!isObject(value)) {
      return true;
    }

    const composite = value as Record<string, unknown>;

    return subFieldNames.every((subFieldName) =>
      isEmptyText(composite[subFieldName]),
    );
  };
