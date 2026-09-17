import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/data/to-text';
import { type LinksValue } from 'src/logic-functions/types/links-value.type';

export const buildLinks = (url: unknown): LinksValue | undefined => {
  const primaryLinkUrl = toText(url);

  return isDefined(primaryLinkUrl)
    ? { primaryLinkUrl, primaryLinkLabel: '', secondaryLinks: null }
    : undefined;
};
