import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/data/to-text';

const LINKEDIN_PROFILE_PATH_REGEX =
  /^(?:https?:\/\/)?(?:[a-z]{2,3}\.)?linkedin\.com(\/(?:in|company)\/[^/?#]+)/i;

export const normalizeLinkedinUrl = (value: unknown): string | undefined => {
  const text = toText(value);

  if (!isDefined(text)) {
    return undefined;
  }

  const profilePathMatch = text.match(LINKEDIN_PROFILE_PATH_REGEX);

  return isDefined(profilePathMatch)
    ? `https://www.linkedin.com${profilePathMatch[1]}`
    : undefined;
};
