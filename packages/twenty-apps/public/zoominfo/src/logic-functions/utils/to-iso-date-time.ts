import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/utils/to-text';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const toIsoDateTime = (value: unknown): string | undefined => {
  const text = toText(value);
  if (!isDefined(text)) {
    return undefined;
  }

  const parsedDate = new Date(
    DATE_ONLY_REGEX.test(text) ? `${text}T00:00:00Z` : text,
  );

  return Number.isNaN(parsedDate.getTime())
    ? undefined
    : parsedDate.toISOString();
};
