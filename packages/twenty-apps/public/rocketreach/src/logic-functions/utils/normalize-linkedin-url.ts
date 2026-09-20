import { toText } from 'src/logic-functions/utils/to-text';
import { isDefined } from 'src/logic-functions/utils/is-defined';

const SCHEME_REGEX = /^[a-z][a-z0-9+.-]*:\/\//;
const LEADING_WWW_REGEX = /^www\./;
const TRAILING_SLASHES_REGEX = /\/+$/;

export const normalizeLinkedinUrl = (
  rawLinkedinUrl: unknown,
): string | undefined => {
  const linkedinUrlText = toText(rawLinkedinUrl);
  if (!isDefined(linkedinUrlText)) {
    return undefined;
  }

  const canonicalUrl = linkedinUrlText
    .toLowerCase()
    .replace(SCHEME_REGEX, '')
    .replace(LEADING_WWW_REGEX, '')
    .replace(TRAILING_SLASHES_REGEX, '');

  return canonicalUrl === '' ? undefined : canonicalUrl;
};
