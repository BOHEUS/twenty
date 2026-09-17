import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/data/to-text';

const SCHEME_PREFIX_REGEX = /^[a-z][a-z0-9+.-]*:\/\//i;
const PATH_SEPARATOR_REGEX = /[/\\?#]/;
const PORT_SUFFIX_REGEX = /:\d+$/;
const LEADING_WWW_REGEX = /^(www\.)+/;
const TRAILING_DOTS_REGEX = /\.+$/;

// Mirrors how Twenty stores company domains, so the result can be compared to
// domainName.primaryLinkUrl as is.
export const normalizeDomain = (value: unknown): string | undefined => {
  const text = toText(value);

  if (!isDefined(text)) {
    return undefined;
  }

  const host = text
    .replace(SCHEME_PREFIX_REGEX, '')
    .split(PATH_SEPARATOR_REGEX)[0]
    .replace(PORT_SUFFIX_REGEX, '')
    .toLowerCase()
    .replace(LEADING_WWW_REGEX, '')
    .replace(TRAILING_DOTS_REGEX, '');

  return host.includes('.') ? host : undefined;
};
