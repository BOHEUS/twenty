import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/data/to-text';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const toEmail = (value: unknown): string | undefined => {
  const text = toText(value);

  return isDefined(text) && EMAIL_REGEX.test(text)
    ? text.toLowerCase()
    : undefined;
};
