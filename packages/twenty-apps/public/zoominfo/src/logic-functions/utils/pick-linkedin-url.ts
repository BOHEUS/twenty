import { isArray } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { toText } from 'src/logic-functions/utils/to-text';
import { isRecord } from 'src/utils/is-record';

const LINKEDIN_HOST_FRAGMENT = 'linkedin.com';

const readUrl = (entry: unknown): string | undefined =>
  isRecord(entry) ? toText(entry.url) : toText(entry);

// Covers both company socialMediaUrls ([{ type, url }]) and contact
// externalUrls, whose entry shape is not documented.
export const pickLinkedinUrl = (entries: unknown): string | undefined => {
  if (!isArray(entries)) {
    return undefined;
  }

  for (const entry of entries) {
    const url = readUrl(entry);

    if (isDefined(url) && url.toLowerCase().includes(LINKEDIN_HOST_FRAGMENT)) {
      return normalizeLinkedinUrl(url);
    }
  }

  return undefined;
};
